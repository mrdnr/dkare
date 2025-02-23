<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# DKare Study Case

Bu proje, kullanıcıların projeler, görevler ve alt görevler oluşturmasına, yönetmesine ve takip etmesine olanak tanıyan bir görev yönetim sistemidir.

## Başlarken

### Gereksinimler
- Node.js (v14 veya üstü)
- MongoDB
- npm veya yarn

### Kurulum
1. **Depoyu Klonlayın:**
   ```bash
   git clone <repository-url>
   ```
2. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   # veya
   yarn install
   ```
3. **Çevre Değişkenlerini Ayarlayın:**
   `.env` dosyasını oluşturun ve gerekli çevre değişkenlerini ayarlayın.

4. **Uygulamayı Başlatın:**
   ```bash
   npm run start
   # veya
   yarn start
   ```

## Kullanım

### API Dokümantasyonu
API dokümantasyonuna erişmek için Swagger kullanılmıştır. Dokümantasyona erişmek için tarayıcınızda şu URL'yi açın:

```bash
http://localhost:3000/docs
```
veya
```bash
https://dkare.onrender.com/docs
```

### Open Api Dokümantasyonu
Open Api dokümantasyonuna erişmek için tarayıcınızda şu URL'yi açın:

```bash
http://localhost:3000/docs-json
```
veya
```bash
https://dkare.onrender.com/docs-json
```


### Özellikler

🔐 Kullanıcı Kayıt ve Giriş: Kullanıcılar sisteme kayıt olabilir ve giriş yapabilir.

📁 Proje Yönetimi: Kullanıcılar projeler oluşturabilir, güncelleyebilir, resim yükleyebilir, görüntüleyebilir ve projeyi silebilir.

📋 Görev Yönetimi: Projeler altında görevler oluşturulabilir, güncellenebilir ve silinebilir. Tüm bu işlemlerden sonra ana proje duruma göre ilerleyiş durumu güncellenir.

🗂️ Alt Görev Yönetimi: Görevler altında alt görevler oluşturulabilir, güncellenebilir ve silinebilir. Tüm bu işlemlerden sonra ana görev ve proje duruma göre ilerleyiş durumu güncellenir.

📊 İlerleme Takibi: Proje, görev ve alt görevlerin ilerleme yüzdesi takip edilebilir.