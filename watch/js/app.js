// ANIMATIONS DES AIGUILLES

// Nombre de secondes avant le commencement de l'animation des aiguilles
var animStart = 0;

// Durée en secondes de l'animation des aiguilles
var dureeAnim = 3;

// Nombre de tours de l'aiguille des minutes
var toursMinutes = 2;

// Nombre de tours de l'aiguille des heures
var toursHeures = 1;

// Nombre de tours de l'aiguille des secondes
var toursSecondes = 4;
// Arrêt de l'animation des aiguilles au bout de x secondes
var stopAnim = 0;

// fréquence de rafraichissement des aiguilles des secondes (nombre de frame par seconde, ici 30)
var framerateSeconds = 30;
var msSeconds = 1000 / framerateSeconds;

// fréquence de rafraichissement des aiguilles du chrono (nombre de frame par seconde, ici 30)
var framerateChrono = 30;
var msChrono = 1000 / framerateChrono;

var wnpSecondes = document.getElementById("wnp_secondes"),
    wnpMinutes = document.getElementById("wnp_minutes"),
    wnpHeures = document.getElementById("wnp_heures"),
    wnpChrono = document.getElementById("wnp_chrono"),
    wnpDate = document.getElementById("wnp_date"),
    i = 0,
    z = 0;

function setDate() {
  if (nextUpdate()) {
    var e = new Date(),
      t = e.getDate(),
      n = e.getSeconds(),
      o = e.getMinutes(),
      s = e.getHours(),
      r = 6 * (n += dureeAnim),
      a = 6 * o + 0.1 * n,
      c = (s / 12) * 360 + (o / 60) * 30;
    if (0 === i) {
      r -= 360 * toursSecondes;
      a -= 360 * toursMinutes;
      c -= 360 * toursHeures;
      wnpSecondes.style.transform = "rotate(" + r + "deg)";
    } else {
      if (1 === i) {
        wnpMinutes.style.transition = "all " + dureeAnim + "s";
        wnpHeures.style.transition = "all " + dureeAnim + "s";
        wnpSecondes.style.transition = "all " + dureeAnim + "s";
        wnpSecondes.style.transform = "rotate(" + r + "deg)";
      } else if (1 < i) {
        wnpMinutes.style.transition = "none";
        wnpHeures.style.transition = "none";
        wnpSecondes.style.transition = "none";
        (r -= 6 * dureeAnim), (a -= (6 * dureeAnim) / 60);
      }
    }

    wnpHeures.style.transform = "rotate(" + c + "deg)";
    wnpMinutes.style.transform = "rotate(" + a + "deg)";
    wnpDate.innerHTML = t;
    i++, z++;
  }
}
var j = 0;

function setSeconds() {
  if (nextUpdate()) {
    var e = new Date(),
      t = e.getDate(),
      n = e.getSeconds(),
      m = e.getMilliseconds(),
      r = 6 * (n += dureeAnim);
    wnpSecondes.style.transition = "none";
    r -= 6 * dureeAnim;
    r += (m / 1000) * 6;
    wnpSecondes.style.transform = "rotate(" + r + "deg)";
  }
}

function setChrono() {
  if (nextUpdate()) {
    var angle = (j / framerateChrono) * 6;
    (wnpChrono.style.transform = "rotate(" + angle + "deg)"), j++;
  }
}

function nextUpdate() {
  return stopAnim === 0 || z < stopAnim - animStart - 3;
}

setDate(),
  setTimeout(function() {
    setDate(),
      setTimeout(function() {
        setInterval(setDate, 1e3);
        setInterval(setSeconds, msSeconds);
        setInterval(setChrono, msChrono);
      }, 1e3 * dureeAnim);
  }, 1e3 * animStart);
