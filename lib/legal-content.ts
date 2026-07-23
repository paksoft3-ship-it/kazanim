import type { LegalSection } from "@/components/public/LegalPageLayout";

/**
 * Fallback legal copy, mirroring prisma/seed.ts so these pages render fully
 * even on an unseeded database. The admin-edited DB content takes precedence.
 * These texts are drafts and must be reviewed by legal counsel before launch.
 */
export const KVKK_SECTIONS: LegalSection[] = [
  { heading: "Veri Sorumlusu", body: ["6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca, kişisel verileriniz veri sorumlusu sıfatıyla Kazanım Gayrimenkul tarafından aşağıda açıklanan kapsamda işlenmektedir."] },
  { heading: "İşlenen Kişisel Veriler", body: ["Web sitemiz üzerinden ilettiğiniz ad soyad, telefon numarası, e-posta adresi ve mesaj içeriği; iş başvurularında ayrıca özgeçmiş dosyanızda yer alan bilgiler işlenmektedir."] },
  { heading: "İşlenme Amaçları", body: ["Kişisel verileriniz; talep ve sorularınızın yanıtlanması, proje bilgilendirmelerinin yapılması, iş başvurularının değerlendirilmesi ve iletişim süreçlerinin yürütülmesi amacıyla işlenmektedir."] },
  { heading: "Veri Toplama Yöntemleri", body: ["Kişisel verileriniz, web sitemizdeki iletişim ve başvuru formları ile elektronik ortamda toplanmaktadır."] },
  { heading: "Hukuki Sebepler", body: ["Verileriniz, Kanun'un 5. maddesinde belirtilen hukuki sebepler kapsamında, açık rızanız veya meşru menfaat hukuki sebebine dayanılarak işlenmektedir."] },
  { heading: "Veri Aktarımı", body: ["Kişisel verileriniz, hizmet aldığımız altyapı ve barındırma sağlayıcıları ile sınırlı olmak üzere, mevzuata uygun şekilde aktarılabilmektedir."] },
  { heading: "Saklama Süresi", body: ["Verileriniz, işlendikleri amaç için gerekli olan süre boyunca ve ilgili mevzuatta öngörülen süreler kadar saklanmaktadır."] },
  { heading: "İnsan Kaynakları Başvuruları", body: ["İş başvurusu kapsamında ilettiğiniz özgeçmiş ve iletişim bilgileri, başvurunuzun değerlendirilmesi amacıyla işlenmekte ve süreç tamamlandıktan sonra mevzuata uygun süre boyunca saklanmaktadır."] },
  { heading: "Çerezler ve Web Analitiği", body: ["Web sitemizde kullanılan çerezler hakkında ayrıntılı bilgi için Çerez Politikamızı inceleyebilirsiniz."] },
  { heading: "Haklarınız", body: ["Kanun'un 11. maddesi uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, düzeltilmesini veya silinmesini isteme ve işlenmesine itiraz etme haklarına sahipsiniz."] },
  { heading: "Başvuru ve İletişim", body: ["Haklarınıza ilişkin taleplerinizi, web sitemizde yer alan iletişim kanalları üzerinden bize iletebilirsiniz."] },
];

export const GIZLILIK_SECTIONS: LegalSection[] = [
  { heading: "Genel Bilgilendirme", body: ["Bu Gizlilik Politikası, Kazanım Gayrimenkul web sitesi üzerinden toplanan bilgilerin nasıl kullanıldığını açıklamaktadır."] },
  { heading: "Toplanan Bilgiler", body: ["Web sitemiz üzerinden yalnızca sizin ilettiğiniz iletişim bilgileri ve mesaj içerikleri toplanmaktadır. Ayrıca site kullanımına ilişkin anonim analitik veriler işlenebilmektedir."] },
  { heading: "Bilgilerin Kullanım Amaçları", body: ["Toplanan bilgiler; taleplerinizin yanıtlanması, hizmet kalitesinin iyileştirilmesi ve yasal yükümlülüklerin yerine getirilmesi amacıyla kullanılmaktadır."] },
  { heading: "Formlar ve İletişim Süreçleri", body: ["İletişim ve bilgi talep formları üzerinden ilettiğiniz veriler, yalnızca talebinizin karşılanması amacıyla kullanılmaktadır."] },
  { heading: "İnsan Kaynakları Başvuruları", body: ["Kariyer başvurularınız kapsamındaki bilgiler yalnızca işe alım süreçlerinde değerlendirilmektedir."] },
  { heading: "Çerezler ve Analitik", body: ["Web sitemizde çerezler kullanılmaktadır. Zorunlu çerezler dışındaki çerezler yalnızca onayınızla çalışır."] },
  { heading: "Üçüncü Taraf Hizmetler", body: ["Web sitemizde analitik ve barındırma amacıyla üçüncü taraf hizmet sağlayıcıları kullanılabilmektedir."] },
  { heading: "Veri Güvenliği", body: ["Verilerinizin güvenliği için teknik ve idari tedbirler uygulanmaktadır."] },
  { heading: "Veri Saklama", body: ["Veriler, işlenme amacının gerektirdiği süre boyunca saklanmaktadır."] },
  { heading: "Kullanıcı Hakları", body: ["KVKK kapsamındaki haklarınızı kullanmak için bizimle iletişime geçebilirsiniz."] },
  { heading: "Politika Güncellemeleri", body: ["Bu politika gerektiğinde güncellenebilir. Güncel sürüm web sitemizde yayımlanır."] },
  { heading: "İletişim", body: ["Sorularınız için web sitemizdeki iletişim kanallarını kullanabilirsiniz."] },
];

export const CEREZ_SECTIONS: LegalSection[] = [
  { heading: "Çerez Nedir?", body: ["Çerezler, ziyaret ettiğiniz web siteleri tarafından cihazınıza kaydedilen küçük metin dosyalarıdır."] },
  { heading: "Çerezleri Neden Kullanıyoruz?", body: ["Çerezleri, web sitemizin düzgün çalışmasını sağlamak, kullanıcı deneyimini iyileştirmek ve site performansını ölçmek için kullanıyoruz."] },
  { heading: "Kullanılan Çerez Türleri", body: ["Web sitemizde zorunlu, analitik, tercih ve pazarlama çerezleri kullanılmaktadır."] },
  { heading: "Zorunlu Çerezler", body: ["Sitenin temel işlevleri ve güvenliği için gereklidir; devre dışı bırakılamaz."] },
  { heading: "Analitik Çerezler", body: ["Ziyaretçilerin siteyi nasıl kullandığını anlamamıza yardımcı olur. Yalnızca onayınızla çalışır."] },
  { heading: "Tercih Çerezleri", body: ["Site üzerindeki tercihlerinizin hatırlanmasını sağlar. Yalnızca onayınızla çalışır."] },
  { heading: "Pazarlama Çerezleri", body: ["İlgi alanlarınıza uygun içerik ve reklam gösterimi için kullanılır. Yalnızca onayınızla çalışır."] },
  { heading: "Üçüncü Taraf Çerezleri", body: ["Analitik ve reklam hizmetleri kapsamında üçüncü taraf çerezleri kullanılabilir."] },
  { heading: "Çerez Tercihleri", body: ["Çerez tercihlerinizi, sitede ilk ziyaretinizde görüntülenen çerez bildirimindeki 'Tercihleri Yönet' seçeneğinden düzenleyebilirsiniz."] },
  { heading: "Tarayıcı Ayarları", body: ["Tarayıcınızın ayarlar bölümünden çerezleri silebilir veya engelleyebilirsiniz. Bu durumda sitenin bazı işlevleri etkilenebilir."] },
  { heading: "Politika Güncellemeleri", body: ["Bu politika gerektiğinde güncellenebilir."] },
  { heading: "İletişim", body: ["Çerez kullanımına ilişkin sorularınız için bizimle iletişime geçebilirsiniz."] },
];

export const KULLANIM_SECTIONS: LegalSection[] = [
  { heading: "Genel Bilgilendirme", body: ["Bu web sitesini kullanarak aşağıdaki kullanım koşullarını kabul etmiş sayılırsınız."] },
  { heading: "Web Sitesi Kullanımı", body: ["Web sitesi içerikleri yalnızca bilgilendirme amaçlıdır ve kişisel kullanım için sunulmaktadır."] },
  { heading: "İçeriklerin Bilgilendirme Niteliği", body: ["Sitede yer alan bilgiler bilgilendirme amaçlı olup, bağlayıcı bir teklif niteliği taşımaz."] },
  { heading: "Proje Bilgileri", body: ["Proje görselleri, planları ve teknik bilgileri temsilî olup, uygulamada değişiklik gösterebilir. Güncel ve bağlayıcı bilgi için satış ekibimizle iletişime geçiniz."] },
  { heading: "Form Kullanımı", body: ["Formlar aracılığıyla ilettiğiniz bilgilerin doğru ve güncel olmasından siz sorumlusunuz."] },
  { heading: "Fikri Mülkiyet Hakları", body: ["Sitede yer alan tüm içerik, görsel ve tasarımların hakları Kazanım Gayrimenkul'e aittir. İzinsiz kullanılamaz."] },
  { heading: "Üçüncü Taraf Bağlantılar", body: ["Sitede yer alabilecek üçüncü taraf bağlantıların içeriğinden Kazanım Gayrimenkul sorumlu değildir."] },
  { heading: "Sorumluluk Sınırı", body: ["Sitenin kullanımından doğabilecek dolaylı zararlardan Kazanım Gayrimenkul sorumlu tutulamaz."] },
  { heading: "Güncelleme Hakkı", body: ["Kazanım Gayrimenkul, bu koşulları önceden bildirmeksizin güncelleme hakkını saklı tutar."] },
  { heading: "Uygulanacak Hukuk", body: ["Bu koşullar Türkiye Cumhuriyeti hukukuna tabidir."] },
  { heading: "İletişim", body: ["Sorularınız için web sitemizdeki iletişim kanallarını kullanabilirsiniz."] },
];
