import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectMemberGuard } from '../guards/project-member.guard';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

interface RequestWithUser extends ExpressRequest {
  user: {
    userId: string;
    email: string;
  };
}

@ApiTags('Projects')
@ApiBearerAuth()
@Controller('projects')
@UseGuards(AuthGuard('jwt'))
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // 📌 Proje oluşturma (Guard yok, çünkü yeni proje oluşturulurken izin kontrolü gerekmiyor)
  @Post()
  @ApiOperation({ summary: 'Yeni proje oluştur' })
  @ApiResponse({ status: 201, description: 'Proje başarıyla oluşturuldu.' })
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Request() req: RequestWithUser,
  ) {
    return this.projectsService.create(createProjectDto, req.user.userId);
  }

  // 📌 Kullanıcının projelerini listeleme (Sadece kullanıcının içinde olduğu projeleri getirir)
  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Kullanıcının projelerini listele' })
  @ApiResponse({
    status: 200,
    description: 'Projeler başarıyla listelendi.',
    schema: {
      properties: {
        projects: {
          type: 'array',
          items: { type: 'object' }
        },
        total: {
          type: 'number',
          description: 'Toplam proje sayısı'
        },
        page: {
          type: 'number',
          description: 'Mevcut sayfa, başlangıç 0'
        },
        size: {
          type: 'number',
          description: 'Sayfa başına proje sayısı, default 10'
        },
        totalPages: {
          type: 'number',
          description: 'Toplam sayfa sayısı'
        }
      }
    }
  })
  async findAll(
    @Request() req: RequestWithUser,
    @Query('page') page: number = 0,
    @Query('size') size: number = 10,
  ) {
    return this.projectsService.findAll(req.user.userId, +page, +size);
  }

  // 📌 Belirli bir projeyi getirme (Kullanıcı proje üyesi olmalı)
  @Get(':id')
  @UseGuards(ProjectMemberGuard)
  @ApiOperation({ summary: 'Belirli bir projeyi getir' })
  @ApiResponse({ status: 200, description: 'Proje başarıyla getirildi.' })
  async findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  // 📌 Projeyi güncelleme (Sadece proje üyesi olanlar güncelleyebilir)
  @Patch(':id')
  @UseGuards(ProjectMemberGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './assets',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
      fileFilter: (req, file, callback) => {
        const allowedTypes = ['.jpeg', '.jpg', '.png', '.svg'];
        const ext = extname(file.originalname).toLowerCase();
        if (!allowedTypes.includes(ext)) {
          return callback(new Error('Only .jpeg, .jpg, and .svg files are allowed'), false);
        }
        callback(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Projeyi güncelle',
    type: UpdateProjectDto,
  })
  @ApiOperation({ summary: 'Projeyi güncelle' })
  @ApiResponse({ status: 200, description: 'Proje başarıyla güncellendi.' })
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.projectsService.update(id, updateProjectDto, file);
  }

  // 📌 Projeyi silme (Sadece proje üyesi olanlar silebilir)
  @Delete(':id')
  @UseGuards(ProjectMemberGuard)
  @ApiOperation({ summary: 'Projeyi sil' })
  @ApiResponse({ status: 200, description: 'Proje başarıyla silindi.' })
  async remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
