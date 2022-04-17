/* global example */
QUnit.module('Long module names', function () {
  // https://en.wikipedia.org/wiki/List_of_long_place_names
  QUnit.module('New Zealand', function () {
    QUnit.module('Taumatawhakatangihangakoauauotamateaturipukakapikimaungahoronukupokaiwhenuakitanatahu', example);
  });
  QUnit.module('South Africa', function () {
    QUnit.module('Tweebuffelsmeteenskootmorsdoodgeskietfontein', example);
  });
  QUnit.module('Thailand', function () {
    QUnit.module('Krungthepmahanakhon Amonrattanakosin Mahintharayutthaya Mahadilokphop Noppharatratchathaniburirom Udomratchaniwetmahasathan Amonphimanawatansathit Sakkathattiyawitsanukamprasit', example);
  });
  QUnit.module('California, United States', function () {
    QUnit.module('El Pueblo de Nuestra Señora la Reina de los Ángeles del Río de Porciúncula', example);
  });
});
