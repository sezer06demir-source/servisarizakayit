import { SITE_URL } from './site-url.mjs';

/**
 * İşletme bilgileri — tek kaynak. Ankara, İstanbul, Bursa ve Denizli'de bağımsız beyaz eşya ve
 * iklimlendirme teknik servisi. Hiçbir markanın yetkili servisi / bayisi değildir.
 */
export const site = {
  name: 'Servis Arıza Kayıt',
  legalName: 'Servis Arıza Kayıt',
  url: SITE_URL,
  tagline: 'Ankara, İstanbul, Bursa ve Denizli Beyaz Eşya ve İklimlendirme Teknik Servisi',
  description:
    'Servis Arıza Kayıt: klima, kombi, buzdolabı, çamaşır ve bulaşık makinesi, televizyon, ankastre ocak arızalarında Ankara, İstanbul, Bursa ve Denizli'de servis. Arızanızı kaydedin, ekip sizi arasın. 0542 403 36 22.',

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

  /** Google Ads (Mr Volt hesabı) dönüşüm etiketi. id boşsa etiket ve çerez çubuğu hiç basılmaz. */
  googleAds: {
    id: 'AW-18322859148',
    phoneLabel: 'VwCnCOKgra4dEIzJgqFE',
    whatsappLabel: 'dxFbCOWgra4dEIzJgqFE',
  },

  hours: { display: '24 saat', opens: '00:00', closes: '23:59', daysText: 'Haftanın 7 günü' },
  area: 'Ankara, İstanbul, Bursa ve Denizli',
  /** Yasal ibare — sitenin her yerinde görünür kılınmalı. */
  disclaimer:
    'Servis Arıza Kayıt bağımsız bir özel teknik servistir. Hiçbir markanın yetkili servisi, resmi temsilcisi ya da bayisi değildir. Marka adları yalnızca hangi cihazlara hizmet verdiğimizi belirtmek için kullanılır.',
} as const;

export const nav = [
  { label: 'Cihazlar', href: '/#cihazlar' },
  { label: 'Servis Süreci', href: '/#surec' },
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
  { value: '4', label: 'ilde servis' },
  { value: '9', label: 'cihaz türü' },
  { value: '7/24', label: 'her gün açık' },
] as const;

/** Sık sorulan sorular. */
export const faq = [
  { q: 'Hangi markalara bakıyorsunuz?', a: 'Cihaz türüne giren tüm markalara servis veriyoruz. Bağımsız bir özel servis olduğumuz için tek markaya bağlı değiliz; parça temininde de esnekiz. Herhangi bir markanın yetkili servisi ya da bayisi değiliz.' },
  { q: 'Ne kadar sürede gelirsiniz?', a: 'Arıza kaydınızı aldıktan sonra en yakın bölge teknisyenimiz kısa sürede sizi arar. Hizmet verdiğimiz illerde aynı gün ya da ertesi gün randevu veriyoruz.' },
  { q: 'Ücreti önceden öğrenebilir miyim?', a: 'Teknisyen arızayı yerinde tespit eder ve işleme başlamadan önce ücreti net söyler. Onayınız olmadan işlem yapılmaz.' },
  { q: 'Yapılan işe garanti veriyor musunuz?', a: 'Evet. Değişen parçaya ve işçiliğe garanti belgesi veriyoruz. Aynı arıza garanti süresi içinde tekrarlarsa ücretsiz bakıyoruz.' },
  { q: 'Servis hangi bölgeleri kapsıyor?', a: 'Ankara, İstanbul, Bursa ve Denizli illerinde servis veriyoruz. Bulunduğunuz ilçeyi arıza kaydında belirtin, hizmet bölgemizdeyse en yakın teknisyeni yönlendirelim.' },
  { q: 'Nasıl arıza kaydı oluştururum?', a: 'Sayfadaki formu doldurun ya da WhatsApp\'tan yazın. Cihazınızı, markayı ve şikâyeti iletin; sizi biz arayalım.' },
];
