# Weather Dashboard — Dizayn ideyaları

## Yanaşma 1

**Theme Name:** Atmosferik Məntəqə

**Very Brief Intro:** Elmi meteoroloji stansiyaların dəqiqliyini redaksiya üslubunun sakitliyi ilə birləşdirən açıq rəngli hava paneli. Məqsəd istifadəçiyə "canlı hava oxunuşu" hissini verməkdir.

**Probability:** 0.06

## Yanaşma 2

**Theme Name:** Gecə Radarı

**Very Brief Intro:** Qaranlıq fonda xəritə-grid və radar halqalarından istifadə edən texniki hava nəzarət interfeysi. Məqsəd intensiv, operativ monitorinq təəssüratı yaratmaqdır.

**Probability:** 0.03

## Yanaşma 3

**Theme Name:** Sakit Səma Jurnalı

**Very Brief Intro:** Yumşaq kağız teksturası, geniş boşluqlar və səma fotosu ilə redaksiya jurnalı estetikasında hava icmalı. Məqsəd gündəlik havanı rahat və zərif oxunaqlı etməkdir.

**Probability:** 0.08

---

# Seçilmiş istiqamət: Atmosferik Məntəqə

## Design Movement

**İnformasiya dizaynı və müasir elmi redaksiya estetikası.** Interfeys analoq meteoroloji cihazların rasional işarələrini, dəqiq ölçü vahidlərini və müasir məhsul panelinin rahatlığını bir araya gətirir.

## Core Principles

1. **Ölçülə bilənlik:** Hər göstərici vahid, kontekst və vizual iyerarxiya ilə aydın oxunmalıdır.
2. **Atmosfer hissi:** Açıq səma gradienti, incə tor xətləri və hava vəziyyətinə uyğun rəng vurğuları məlumatı emosional, lakin sakit təqdim edir.
3. **Asimmetrik nizam:** Böyük temperatur oxunuşu solda dominantdır; dəstək metrikləri və proqnoz məlumatı modul axınla yerləşir.
4. **Səssiz texnologiya:** Effektlər məlumatın önünə keçmir; kölgələr, tekstura və animasiya incə və məqsədyönlüdür.

## Color Philosophy

Fon səmadakı dumanı xatırladan **soyuq arktik-ağ və mavi-boz** tonlarındadır; bu, canlı rəqəmlərin rahat oxunmasını təmin edir. İmza rəngi olan **barometrik portağal** temperatur və vacib hərəkət nöqtələrini istilik hissi ilə vurğulayır. Dərin göy-mavi isə etibarlı, texniki məlumat səviyyəsini qurur.

## Layout Paradigm

Səhifə simmetrik kart divarı deyil, solda əsas hava oxunuşu olan **meteoroloji oxu zolağı** və sağda kontekst modullarının yerləşdiyi qeyri-bərabər redaksiya lövhəsidir. Başlıq və axtarış yuxarıda geniş, sonra temperatur bloku, vəziyyət illüstrasiyası və metrik lentləri müxtəlif hündürlüklərdə axır.

## Signature Elements

1. Arxa fonda çox incə enlik-uzunluq hissi yaradan **meteoroloji koordinat toru**.
2. Cari temperaturun yanında yarımdairə formalı **barometr halqası**.
3. Metrik kartlarında külək istiqamətini və təzyiq oxunuşunu xatırladan **mikro-ölçü cizgiləri**.

## Interaction Philosophy

Axtarış istifadəçinin əsas laboratoriya alətidir: fokusda aydın xətt, axtarışda yükləmə vəziyyəti və nəticədə qısa yenilənmə reaksiyası verir. Tez axtarış düymələri dərhal eyni davranışı işlədir. İstifadəçi bütün vaxtlarda hansı məlumatın yeniləndiyini və xəta olduqda nə etməli olduğunu görür.

## Animation

İlk yükləmədə əsas oxunuş və metrik kartlar 30–80 ms fərqlə yüngül yuxarı hərəkət və şəffaflıq keçidi ilə görünür. Axtarış nəticəsində məzmun təxminən 180–220 ms ərzində yumşaq opacity/translate keçidi ilə dəyişir. Hover və kliklər qısa, fiziki cavab verir; `prefers-reduced-motion` aktiv olduqda bütün qeyri-vacib hərəkətlər dayandırılır.

## Typography System

Başlıqlar və temperatur üçün **DM Serif Display** istifadə edilir: atmosferik, ölçülü və xarakterlidir. Məlumat etiketləri və idarələr üçün **Manrope** seçilir: rəqəmlər və kiçik vahidlərdə texniki oxunaqlıdır. Temperatur 5–6 pillə daha böyük, metrik vahidlər isə hərf aralığı artırılmış kiçik böyük hərflərlə göstərilir.

## Brand Essence

**Weather Dashboard — şəhər havasını canlı, dəqiq və sakit oxu panelində izləmək istəyənlər üçün meteoroloji məlumat aləti.**

Şəxsiyyət: **dəqiq, sakit, rasional**.

## Brand Voice

Başlıqlar müşahidə dili ilə qısa və dəqiq yazılır; çağırışlar əmr formasında yumşaq, konkret olur; mikro-mətnlər istifadəçiyə növbəti addımı izah edir.

Nümunə xətlər:

> “Şəhərin hava ritmini oxu.”

> “Şəhər adı yazın və canlı göstəriciləri yeniləyin.”

## Wordmark & Logo

Loqo sözsüz, içində üç konsentrik barometr qövsü və şimal istiqamətini göstərən qısa ox olan **kompas-barometr nişanı**dır. Bu işarə yüklənmə vəziyyətində sadə fırlanma üçün də istifadə olunur.

## Signature Brand Color

**Barometrik Portağal — `#F06F37`**. Temperatur, aktiv axtarış və əhəmiyyətli status nöqtələri üçün yalnız bu rəngdən istifadə olunur.

## Style Decisions

İlk ekranın əsas vizualı həmişə soldakı böyük DM Serif temperatur oxunuşudur; tünd səth yalnız ölçü üçün fon rolunu oynayır. `#F06F37` temperatur, aktiv axtarış və kritik ölçü nişanları üçün ayrılır. Hər əsas məlumat modulu koordinat toru, cihaz cizgisi, kompas/barometr qövsü və ya ölçü bölücüsü kimi ən azı bir meteoroloji alət işarəsi daşıyır.
