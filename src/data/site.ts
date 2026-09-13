import { SITE_URL } from './site-url.mjs';

/**
 * İşletme bilgileri — tek kaynak. Türkiye geneli bağımsız beyaz eşya ve
 * iklimlendirme teknik servisi. Hiçbir markanın yetkili servisi / bayisi değildir.
 */
export const site = {
  name: 'Servis Arıza Kayıt',
  legalName: 'Servis Arıza Kayıt',
  url: SITE_URL,
  tagline: 'Türkiye Geneli Beyaz Eşya ve İklimlendirme Teknik Servisi',
  description:
    'Servis Arıza Kayıt: klima, kombi, buzdolabı, çamaşır ve bulaşık makinesi, televizyon, ankastre ocak arızalarında Türkiye geneli servis ağı. Arızanızı kaydedin, ekip sizi arasın. 0542 403 36 22.',

  phone: {
    display: '0542 403 36 22',
    href: 'tel:+905424033622',
    e164: '+905424033622',
  },
  whatsapp: {
    number: '905424033622',
    message: 'Merhaba, bir beyaz eşya arızası için servis kaydı oluşturmak istiyorum.',
    get href() {
      return `https://wa.me/${this.number}?text=${encodeURIComponent(this.message)}`;
    },
  },

  hours: { display: '08:00 – 22:00', opens: '08:00', closes: '22:00', daysText: 'Haftanın 7 günü' },
  area: 'Türkiye geneli servis ağı',
  /** Yasal ibare — sitenin her yerinde görünür kılınmalı. */
  disclaimer:
    'Servis Arıza Kayıt bağımsız bir özel teknik servistir. Hiçbir markanın yetkili servisi, resmi temsilcisi ya da bayisi değildir. Marka adları yalnızca hangi cihazlara hizmet verdiğimizi belirtmek için kullanılır.',
} as const;

export const nav = [
  { label: 'Cihazlar', href: '/#cihazlar' },
  { label: 'Servis Süreci', href: '/#surec' },
  { label: 'Yorumlar', href: '/#yorumlar' },
  { label: 'Arıza Kaydı', href: '/ariza-kayit' },
  { label: 'İletişim', href: '/iletisim' },
] as const;

export interface Device {
  slug: string;
  name: string;
  icon: string;
  /** Kartta görünen tek cümle */
  blurb: string;
  /** En sık gelen belirtiler */
  symptoms: string[];
}

export const devices: Device[] = [
  { slug: 'camasir-makinesi', name: 'Çamaşır Makinesi', icon: 'washer', blurb: 'Su almıyor, sıkmıyor, ses yapıyor ya da hata kodu veriyor.', symptoms: ['Su almıyor / boşaltmıyor', 'Sıkma yapmıyor', 'Aşırı titreşim ve gürültü', 'Hata kodu / çalışmıyor'] },
  { slug: 'bulasik-makinesi', name: 'Bulaşık Makinesi', icon: 'dishwasher', blurb: 'Yıkamıyor, su kaçırıyor ya da programda takılıyor.', symptoms: ['Temiz yıkamıyor', 'Su kaçağı', 'Kurutmuyor', 'Programda kalıyor'] },
  { slug: 'buzdolabi', name: 'Buzdolabı', icon: 'fridge', blurb: 'Soğutmuyor, çok çalışıyor ya da su biriktiriyor.', symptoms: ['Soğutmuyor / az soğutuyor', 'Sürekli çalışıyor', 'Ses / titreşim', 'Alt tabanda su'] },
  { slug: 'derin-dondurucu', name: 'Derin Dondurucu', icon: 'freezer', blurb: 'Dondurmuyor, buz tutuyor ya da alarm veriyor.', symptoms: ['Yeterince dondurmuyor', 'Aşırı buzlanma', 'Kapak tam kapanmıyor', 'Sıcaklık alarmı'] },
  { slug: 'klima', name: 'Klima', icon: 'ac', blurb: 'Soğutmuyor, su damlatıyor ya da koku yapıyor. Bakım ve gaz dolumu.', symptoms: ['Soğutmuyor / ısıtmıyor', 'İç üniteden su damlıyor', 'Koku ve kirlilik', 'Gaz azalması'] },
  { slug: 'kombi', name: 'Kombi', icon: 'boiler', blurb: 'Yanmıyor, basınç düşüyor ya da sıcak su vermiyor.', symptoms: ['Ateşleme yapmıyor', 'Basınç düşüyor', 'Sıcak su gelmiyor', 'Arıza kodu yanıyor'] },
  { slug: 'televizyon', name: 'Televizyon', icon: 'tv', blurb: 'Görüntü yok, ekranda çizgi ya da açılmıyor.', symptoms: ['Açılmıyor / ışık yanıp sönüyor', 'Görüntü yok, ses var', 'Ekranda çizgi / leke', 'Panel arızası'] },
  { slug: 'kurutma-makinesi', name: 'Kurutma Makinesi', icon: 'dryer', blurb: 'Kurutmuyor, ısıtmıyor ya da hata veriyor.', symptoms: ['Kurutmuyor', 'Isınmıyor', 'Su haznesi dolu uyarısı', 'Tambur dönmüyor'] },
  { slug: 'ankastre-ocak', name: 'Ankastre Ocak & Fırın', icon: 'stove', blurb: 'Ateş almıyor, ısınmıyor ya da program tutmuyor.', symptoms: ['Ocak ateş almıyor', 'Fırın ısınmıyor', 'Isı ayarı tutmuyor', 'Cam / conta sorunu'] },
];

/** Servis süreci — 4 adım. */
export const steps = [
  { title: 'Arızayı kaydedin', text: 'Formu doldurun ya da WhatsApp\'tan yazın. Cihaz, marka ve şikâyeti alırız. Bir dakikanızı bile almaz.' },
  { title: 'Sizi arayalım', text: 'En yakın bölge teknisyenimiz kısa sürede sizi arar, uygun randevu saatini birlikte belirleriz.' },
  { title: 'Yerinde tespit', text: 'Teknisyen adrese gelir, arızayı tespit eder, ne yapılacağını ve ücretini işlem öncesi söyler.' },
  { title: 'Onarım ve garanti', text: 'Onayınızla onarımı tamamlar, değişen parçaya ve işçiliğe garanti belgesi bırakırız.' },
];

export const stats = [
  { value: '81', label: 'ilde servis ağı' },
  { value: '9', label: 'cihaz türü' },
  { value: '08–22', label: 'her gün açık' },
] as const;

export interface Review {
  name: string;
  city: string;
  device: string;
  stars: number;
  text: string;
}

/** Örnek müşteri yorumları. İşletme gerçek yorumlarla değiştirebilir. */
export const reviews: Review[] = [
  { name: 'Ayşe K.', city: 'İstanbul', device: 'Çamaşır Makinesi', stars: 5, text: 'Makinem su almıyordu, aynı gün geldiler. Usta arızayı 10 dakikada buldu, fiyatı baştan söyledi. Temiz iş çıkardılar.' },
  { name: 'Mehmet D.', city: 'Ankara', device: 'Kombi', stars: 5, text: 'Kombi kışın ortasında sustu. Akşam aradım, ertesi sabah buradaydılar. Basınç sorununu çözdüler, güler yüzlüydüler.' },
  { name: 'Zeynep A.', city: 'İzmir', device: 'Buzdolabı', stars: 5, text: 'Dolap soğutmuyordu, bozulacak diye korktum. Hızlı geldiler, gaz ve kompresör kontrolü yaptılar. Şimdi buz gibi.' },
  { name: 'Hasan Y.', city: 'Bursa', device: 'Klima', stars: 4, text: 'Yaz sıcağında klima soğutmuyordu. Bakım ve gaz dolumu yaptılar. Randevuya birkaç saat geç kaldılar ama iş temizdi.' },
  { name: 'Fatma T.', city: 'Antalya', device: 'Bulaşık Makinesi', stars: 5, text: 'Su kaçırıyordu, mutfağı su basıyordu. Contayı ve tahliyeyi değiştirdiler. Fiyatı gayet uygundu, teşekkürler.' },
  { name: 'Ömer S.', city: 'Konya', device: 'Televizyon', stars: 5, text: 'Ekranda görüntü gitmişti, çöpe atacaktım. Panel yerine bir kart değişimiyle çözdüler. Dürüst servis, tavsiye ederim.' },
  { name: 'Elif B.', city: 'Gaziantep', device: 'Ankastre Fırın', stars: 5, text: 'Fırın ısınmıyordu. Rezistans değişti, aynı gün bitti. Usta çok bilgiliydi, her şeyi açıkladı.' },
  { name: 'Mustafa Ç.', city: 'Adana', device: 'Kurutma Makinesi', stars: 4, text: 'Kurutmuyordu, nem sensörü arızalıymış. Parça bir gün sonra geldi ama sağ olsunlar hallettiler.' },
  { name: 'Seda N.', city: 'Kayseri', device: 'Derin Dondurucu', stars: 5, text: 'Dondurucu buz tutmuştu, alarm veriyordu. Termostatı değiştirdiler, garanti belgesi bıraktılar. Çok memnun kaldım.' },
  { name: 'Kemal R.', city: 'Samsun', device: 'Çamaşır Makinesi', stars: 5, text: 'Sıkma yapmıyordu, rulman sesi vardı. Randevu saatinde geldiler, işi tek seferde bitirdiler. Fiyat baştan belliydi.' },
  { name: 'Gül İ.', city: 'Eskişehir', device: 'Klima', stars: 5, text: 'İç üniteden su damlıyordu. Tahliye hortumunu temizleyip bakım yaptılar. Nazik ve titiz çalıştılar.' },
  { name: 'Burak V.', city: 'Mersin', device: 'Buzdolabı', stars: 5, text: 'No-frost dolabım çalışmıyordu. Fanı ve sensörü değiştirdiler. Aynı gün servis, uygun ücret. Numarayı kaydettim.' },
];

/** Sık sorulan sorular. */
export const faq = [
  { q: 'Hangi markalara bakıyorsunuz?', a: 'Cihaz türüne giren tüm markalara servis veriyoruz. Bağımsız bir özel servis olduğumuz için tek markaya bağlı değiliz; parça temininde de esnekiz. Herhangi bir markanın yetkili servisi ya da bayisi değiliz.' },
  { q: 'Ne kadar sürede gelirsiniz?', a: 'Arıza kaydınızı aldıktan sonra en yakın bölge teknisyenimiz kısa sürede sizi arar. Çoğu ilde aynı gün ya da ertesi gün randevu veriyoruz.' },
  { q: 'Ücreti önceden öğrenebilir miyim?', a: 'Teknisyen arızayı yerinde tespit eder ve işleme başlamadan önce ücreti net söyler. Onayınız olmadan işlem yapılmaz.' },
  { q: 'Yapılan işe garanti veriyor musunuz?', a: 'Evet. Değişen parçaya ve işçiliğe garanti belgesi veriyoruz. Aynı arıza garanti süresi içinde tekrarlarsa ücretsiz bakıyoruz.' },
  { q: 'Servis hangi bölgeleri kapsıyor?', a: 'Türkiye geneli bir servis ağıyla çalışıyoruz. Bulunduğunuz ili arıza kaydında belirtmeniz yeterli; size en yakın teknisyeni yönlendiririz.' },
  { q: 'Nasıl arıza kaydı oluştururum?', a: 'Sayfadaki formu doldurun ya da WhatsApp\'tan yazın. Cihazınızı, markayı ve şikâyeti iletin; sizi biz arayalım.' },
];
