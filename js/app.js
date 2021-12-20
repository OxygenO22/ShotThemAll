/*///////////////////////// ПОЛУЧЕНИЕ ЭЛЕМЕНТОВ DOM ///////////////////////////////////*/

let intro = document.getElementById('intro');
let buttonPlay = document.getElementById('button_play');
let buttonRepeat = document.getElementById('button_repeat');
let buttonBackSet = document.getElementById('button_back_set');
let settings = document.getElementById('settings');
let buttonSettings = document.getElementById('button_settings');
let instruction = document.getElementById('instruction');
let buttonInstruction = document.getElementById('button_instruction');
let buttonBackInstr = document.getElementById('button_back_instr');
let buttonReset = document.getElementById('button_back_reset');
let points = document.getElementById('points');
let pointsInner = document.getElementById('points__inner');
let bestResult = document.getElementById('best_result');
let listPoint = document.getElementById('list_point');
let playerName = document.getElementById('name');
let timeGame = document.getElementById('time_game');
let gameDifficulty = document.getElementById('game_difficulty');
let volumeSound = document.getElementById('volume_sound');
let volumeHeight = document.getElementById('volume_height');

/*///////////////////////// ПЕРЕМЕННЫЕ ДЛЯ СОХРАНЕНИЯ НАСТРОЕК ///////////////////////////////////*/
let currentName;
let currentTimeGame;
let currentGameDifficulty;
let currentVolumeSound;


/*///////////////////////// СОХРАНЕНИЕ НАСТРОЕК ИГРЫ ///////////////////////////////////*/
function saveSettings() {
   if (currentName != localStorage.getItem('currentName') || localStorage.getItem('currentName') === null) {
      currentName = playerName.value;
      localStorage.setItem('currentName', JSON.stringify(currentName));
      playerName.setAttribute('value', currentName);
   }
   if (currentTimeGame != localStorage.getItem('currentTimeGame') || localStorage.getItem('currentTimeGame') === null) {
      currentTimeGame = timeGame.value;
      localStorage.setItem('currentTimeGame', JSON.stringify(currentTimeGame));
      timeGame.setAttribute('value', currentTimeGame);
   }
   if (currentGameDifficulty != localStorage.getItem('currentGameDifficulty') || localStorage.getItem('currentGameDifficulty') === null) {
      currentGameDifficulty = gameDifficulty.value;
      localStorage.setItem('currentGameDifficulty', JSON.stringify(currentGameDifficulty));
      gameDifficulty.setAttribute('value', currentGameDifficulty);
   }
   if (currentVolumeSound != localStorage.getItem('currentVolumeSound') || localStorage.getItem('currentVolumeSound') === null) {
      currentVolumeSound = volumeSound.value;
      localStorage.setItem('currentVolumeSound', JSON.stringify(currentVolumeSound));
      volumeSound.setAttribute('value', currentVolumeSound);
   }
}

document.addEventListener('DOMContentLoaded', () => {
   if (currentName != localStorage.getItem('currentName')) {
      currentName = JSON.parse(localStorage.getItem('currentName'));
      localStorage.setItem('currentName', JSON.stringify(currentName));
      playerName.setAttribute('value', currentName);
   }
   if (currentTimeGame != localStorage.getItem('currentTimeGame')) {
      currentTimeGame = JSON.parse(localStorage.getItem('currentTimeGame'));
      localStorage.setItem('currentTimeGame', JSON.stringify(currentTimeGame));
      timeGame.setAttribute('value', currentTimeGame);
   }
   if (currentGameDifficulty != localStorage.getItem('currentGameDifficulty')) {
      currentGameDifficulty = JSON.parse(localStorage.getItem('currentGameDifficulty'));
      localStorage.setItem('currentGameDifficulty', JSON.stringify(currentGameDifficulty));
      gameDifficulty.setAttribute('value', currentGameDifficulty);
   }
   if (currentVolumeSound != localStorage.getItem('currentVolumeSound')) {
      currentVolumeSound = JSON.parse(localStorage.getItem('currentVolumeSound'));
      localStorage.setItem('currentVolumeSound', JSON.stringify(currentVolumeSound));
      volumeSound.setAttribute('value', currentVolumeSound);
   }
});


/*///////////////////////// КНОПКИ МЕНЮ ///////////////////////////////////*/
buttonPlay.addEventListener('click', playGame);

buttonSettings.addEventListener('click', () => {
   settings.style.cssText = 'display: flex;';
   intro.style.cssText = 'display: none;';
});
buttonBackSet.addEventListener('click', () => {
   settings.style.cssText = 'display: none;';
   intro.style.cssText = 'display: flex;';
});
buttonInstruction.addEventListener('click', () => {
   instruction.style.cssText = 'display: flex;';
   intro.style.cssText = 'display: none;';
});
buttonBackInstr.addEventListener('click', () => {
   instruction.style.cssText = 'display: none;';
   intro.style.cssText = 'display: flex;';
});
buttonReset.addEventListener('click', () => {
   localStorage.clear();
   listPoint.remove();
   bestResult.innerHTML = '0' + ' --- очков';
});


/*///////////////////////// ИГРА ///////////////////////////////////*/
function playGame() {
   saveSettings();
   // Определение канваса
   let cnv = document.getElementById('canvas');
   let ctx = cnv.getContext('2d');
   cnv.width = window.innerWidth;
   cnv.height = window.innerHeight;

   //интро
   intro.style.cssText = 'display: none;';

   /*///////////////////////// ПЕРЕМЕННЫЕ ///////////////////////////////////*/
   let playerArr = [];
   let bird = [];
   let birdbuh = [];
   let clock = [];
   let bomb = [];
   let boom = [];
   let vor = [];
   let vorbuh = [];
   let homesmoke = [];
   let bombboom = [];
   let playDif;
   let playDifEmerg;
   let record;
   let bestPlayer;
   let timer = 0;
   let counter = 0;
   let countShot = 0;
   let life = 5;
   let bigGun = 5;
   let playTime = timeGame.value;
   let gameAnimation;
   let clockTimeout;
   let bombTimeout;
   let sight = { x: 320, y: 240 };
   let fonSound;


   /*///////////////////////// ОПРЕДЕЛЕНИЕ СЛОЖНОСТИ ИГРЫ ///////////////////////////////////*/
   if (gameDifficulty.value == 100) {
      playDif = 2.4;
      playDifEmerg = 35;
   }
   else if (gameDifficulty.value == 80) {
      playDif = 2.2;
      playDifEmerg = 45;
   }
   else if (gameDifficulty.value == 60) {
      playDif = 2.0;
      playDifEmerg = 65;
   }
   else if (gameDifficulty.value == 40) {
      playDif = 1.8;
      playDifEmerg = 75;
   }
   else if (gameDifficulty.value == 20) {
      playDif = 1.4;
      playDifEmerg = 95;
   }


   /*///////////////////////// ЗВУКИ ///////////////////////////////////*/
   //музыка
   function fonSoundFunc() {
      fonSound = document.createElement('audio');
      fonSound.src = 'audio/fon4.mp3';
      fonSound.volume = volumeSound.value;
      fonSound.play();
      fonSound.loop = true;
   }
   fonSoundFunc();
   function fonStopSoundFunc() {
      fonSound.pause();
   }
   //выстрел левой
   function shotGunSoundFunc() {
      let shotGunSound = document.createElement('audio');
      shotGunSound.src = 'audio/vistrel_vintovki.mp3';
      if (shotGunSound.volume == 0.1) {
         shotGunSound.volume = volumeSound.value + 0.1;
      } else {
         shotGunSound.volume = volumeSound.value;
      }
      shotGunSound.play();
   };
   //выстрел правой
   function shotGunRightSoundFunc() {
      let shotGunRightSound = document.createElement('audio');
      shotGunRightSound.src = 'audio/vystrel_right.mp3';
      if (shotGunRightSound.volume == 0.1) {
         shotGunRightSound.volume = volumeSound.value + 0.1;
      } else {
         shotGunRightSound.volume = volumeSound.value;
      }
      shotGunRightSound.play();
   };
   //нет патронов
   function shotGunEmptySoundFunc() {
      let shotGunEmptySound = document.createElement('audio');
      shotGunEmptySound.src = 'audio/bez_patronov.mp3';
      if (shotGunEmptySound.volume == 0.1) {
         shotGunEmptySound.volume = volumeSound.value + 0.1;
      } else {
         shotGunEmptySound.volume = volumeSound.value;
      }
      shotGunEmptySound.play();
   };
   //птица подстрелена
   function birdShotedSoundFunc() {
      let birdShotedSound = document.createElement('audio');
      birdShotedSound.src = 'audio/podstrelen.mp3';
      if (birdShotedSound.volume == 0.1) {
         birdShotedSound.volume = volumeSound.value + 0.1;
      } else {
         birdShotedSound.volume = volumeSound.value;
      }
      birdShotedSound.play();
   };
   //птица смеется
   function birdLaughSoundFunc() {
      let birdLaughSound = document.createElement('audio');
      birdLaughSound.src = 'audio/birdLaugh.mp3';
      if (birdLaughSound.volume == 0.1) {
         birdLaughSound.volume = volumeSound.value + 0.1;
      } else {
         birdLaughSound.volume = volumeSound.value;
      }
      birdLaughSound.play();
   }
   //рикошет
   function shotRicochetSoundFunc() {
      let shotRicochetSound = document.createElement('audio');
      shotRicochetSound.src = 'audio/rikoshet_pulya1.mp3';
      if (shotRicochetSound.volume == 0.1) {
         shotRicochetSound.volume = volumeSound.value + 0.1;
      } else {
         shotRicochetSound.volume = volumeSound.value;
      }
      shotRicochetSound.play();
   };
   //бомба летит
   function bombFlySoundFunc() {
      let bombFlySound = document.createElement('audio');
      bombFlySound.src = 'audio/bombFly.mp3';
      if (bombFlySound.volume == 0.1) {
         bombFlySound.volume = volumeSound.value + 0.1;
      } else {
         bombFlySound.volume = volumeSound.value;
      }
      bombFlySound.play();
   };
   //бомба взорвалась
   function bombBoomSoundFunc() {
      let bombBoomSound = document.createElement('audio');
      bombBoomSound.src = 'audio/bombBoom.mp3';
      if (bombBoomSound.volume == 0.1) {
         bombBoomSound.volume = volumeSound.value + 0.1;
      } else {
         bombBoomSound.volume = volumeSound.value;
      }
      bombBoomSound.play();
   };
   //будильник
   function clockSoundFunc() {
      let clockSound = document.createElement('audio');
      clockSound.src = 'audio/budilnik1.mp3';
      if (clockSound.volume == 0.1) {
         clockSound.volume = volumeSound.value + 0.1;
      } else {
         clockSound.volume = volumeSound.value;
      }
      clockSound.play();
   };
   //вор побежал
   function vorRunSoundFunc() {
      let vorRunSound = document.createElement('audio');
      vorRunSound.src = 'audio/vor_bye.mp3';
      if (vorRunSound.volume == 0.1) {
         vorRunSound.volume = volumeSound.value + 0.1;
      } else {
         vorRunSound.volume = volumeSound.value;
      }
      vorRunSound.play();
   };
   //вор подбит
   function vorShotSoundFunc() {
      let vorShotSound = document.createElement('audio');
      vorShotSound.src = 'audio/vor_why.mp3';
      if (vorShotSound.volume == 0.1) {
         vorShotSound.volume = volumeSound.value + 0.1;
      } else {
         vorShotSound.volume = volumeSound.value;
      }
      vorShotSound.play();
   };
   //вор убежал
   function vorRunAwaySoundFunc() {
      let vorRunAwaySound = document.createElement('audio');
      vorRunAwaySound.src = 'audio/vor_seeya.mp3';
      if (vorRunAwaySound.volume == 0.1) {
         vorRunAwaySound.volume = volumeSound.value + 0.1;
      } else {
         vorRunAwaySound.volume = volumeSound.value;
      }
      vorRunAwaySound.play();
   };
   //таймер
   let timerSound = document.createElement('audio');
   timerSound.src = 'audio/timer2.mp3';
   if (timerSound.volume == 0.1) {
      timerSound.volume = volumeSound.value + 0.1;
   } else {
      timerSound.volume = volumeSound.value;
   }


   /*///////////////////////// ИЗОБРАЖЕНИЯ ///////////////////////////////////*/
   let fonimg = new Image();
   fonimg.src = 'img/fon4.jpg';
   let sightimg = new Image();
   sightimg.src = 'img/sight.png';
   let boomimg = new Image();
   boomimg.src = 'img/buh.png';
   let birdimg = new Image();
   birdimg.src = 'img/bird.png';
   let birdbuhimg = new Image();
   birdbuhimg.src = 'img/birdbuh.png';
   let clockimg = new Image();
   clockimg.src = 'img/clock.png';
   let bombimg = new Image();
   bombimg.src = 'img/bomb.png';
   let bombboomimg = new Image();
   bombboomimg.src = 'img/bombBoom.png';
   let tree1img = new Image();
   tree1img.src = 'img/tree1little.png';
   let grassimg = new Image();
   grassimg.src = 'img/grass.png';
   let tree2img = new Image();
   tree2img.src = 'img/tree2little.png';
   let homeimg = new Image();
   homeimg.src = 'img/dom5.png';
   let vorimg = new Image();
   vorimg.src = 'img/vorPsh.png';
   let vorbuhimg = new Image();
   vorbuhimg.src = 'img/vorbuh.png';
   let kustimg = new Image();
   kustimg.src = 'img/kust.png';
   let kustaimg = new Image();
   kustaimg.src = 'img/kust.png';
   let kust2img = new Image();
   kust2img.src = 'img/kust2.png';
   let tree3img = new Image();
   tree3img.src = 'img/tree3little.png';
   let tree4img = new Image();
   tree4img.src = 'img/tree4.png';
   let flaversimg = new Image();
   flaversimg.src = 'img/flavers.png';
   let flavers2img = new Image();
   flavers2img.src = 'img/flavers2little.png';

   /*///////////////////////// ПОЯВЛЕНИЯ ///////////////////////////////////*/
   //появление птиц
   function birdEmerg() {
      timer += 2;
      if (timer % playDifEmerg == 0) {
         bird.push({
            x: -70,
            y: Math.random() * 530,
            bx: Math.random() * (Math.random() + 1 * playDif),
            by: Math.random() * (Math.random() + 1 * playDif),
            del: 0,
            animx: 0,
            animy: 0,
         });
      }
   }
   //появление часов
   function clockEmerg() {
      clockTimeout = setTimeout(() => {
         clockSoundFunc();
         if (clock.length < 1) {
            clock.push({
               x: -70,
               y: Math.random() * 530,
               bx: Math.random() * (Math.random() + 3 * playDif),
               by: Math.random() * (Math.random() + 3 * playDif),
               del: 0,
               animx: 0,
               animy: 0,
            });
         }
      }, (Math.round(1500 * (Math.random() * (12 - 9) + 9))));

   };

   //появление бомбы
   function bombEmerg() {
      bombTimeout = setTimeout(() => {
         bombFlySoundFunc();
         if (bomb.length < 1) {
            bomb.push({
               x: Math.random() * 730,
               y: -70,
               bx: Math.random() * (Math.random() + 3 * playDif),
               by: Math.random() * (Math.random() + 2 * playDif),
               del: 0,
               animx: 0,
               animy: 0,
            });
         }
      }, (Math.round(2000 * (Math.random() * (12 - 9) + 9))));
   };

   //появление вора
   function vorEmerg() {
      if (vor.length < 1) {
         vor.push({
            x: cnv.width - 180,
            y: cnv.height - 330,
            bx: Math.random() * (Math.random() + 4 * playDif),
            del: 0,
            animx: 0,
            animy: 0,
         });
      }
   };
   //появление дыма дома
   function homesmokeEmerg() {
      if (homesmoke.length < 1) {
         homesmoke.push({
            x: cnv.width - 85,
            y: cnv.height - 590,
            del: 0,
            animx: 0,
            animy: 0,
         });
      }
   };

   /*///////////////////////// АНИМАЦИЯ ///////////////////////////////////*/
   //анимация птиц
   function animBird() {
      for (i in bird) {
         bird[i].animx = bird[i].animx + .3;
         if (bird[i].animx > 4) {
            bird[i].animy++;
            bird[i].animx = 0;
         }
         if (bird[i].animy > 2) {
            bird[i].animx++;
            bird[i].animy = 0;
         }
      }
   }
   //анимация попадания в птиц
   function animBirdBuh() {
      for (i in birdbuh) {
         birdbuh[i].animx = birdbuh[i].animx + .2;
         if (birdbuh[i].animx > 3) {
            birdbuh[i].animy++;
            birdbuh[i].animx = 0;
         }
      }
   }
   //анимация попадания
   function animBoom() {
      for (i in boom) {
         boom[i].animx = boom[i].animx + .7;
         if (boom[i].animx > 4) {
            boom[i].animy++;
            boom[i].animx = 0;
         }
         if (boom[i].animy > 4) {
            boom[i].animx++;
            boom[i].animy = 0;
            boom.splice(i, 1);
         }
      }
   }
   //анимация взрыва бомбы
   function animBombBoom() {
      for (i in bombboom) {
         bombboom[i].animx = bombboom[i].animx + .2;
         if (bombboom[i].animx > 3) {
            bombboom[i].animy++;
            bombboom[i].animx = 0;
         }
         if (bombboom[i].animy > 2) {
            bombboom[i].animy++;
            bombboom[i].animx = 0;
            bombboom.splice(i, 1);
         }
      }
   }
   //анимация бега вора
   function animVor() {
      for (i in vor) {
         vor[i].animx = vor[i].animx + .2;
         if (vor[i].animx > 3) {
            vor[i].animy++;
            vor[i].animx = 0;
         }
         if (vor[i].animy > 1) {
            vor[i].animx++;
            vor[i].animy = 0;
         }
      }
   }
   //анимация взрыва вора
   function animVorBuh() {
      for (i in vorbuh) {
         vorbuh[i].animx = vorbuh[i].animx + .3;
         if (vorbuh[i].animx > 4) {
            vorbuh[i].animy++;
            vorbuh[i].animx = 0;
         }
         if (vorbuh[i].animy > 3) {
            vorbuh[i].animx++;
            vorbuh[i].animy = 0;
            vorbuh.splice(i, 1);
         }
      }
   }
   //анимация дыма из дымохода
   function animhomesmoke() {
      for (i in homesmoke) {
         homesmoke[i].animx = homesmoke[i].animx + .2;
         if (homesmoke[i].animx > 4) {
            homesmoke[i].animy++;
            homesmoke[i].animx = 0;
         }
         if (homesmoke[i].animy > 3) {
            homesmoke[i].animx++;
            homesmoke[i].animy = 0;
            homesmoke.splice(i, 1);
         }
      }
   }

   /*///////////////////////// ФИЗИКА ///////////////////////////////////*/
   //полет птиц
   function birdFly() {
      //физика
      for (let i = 0; i < bird.length; i++) {
         bird[i].x += bird[i].bx;
         bird[i].y += bird[i].by;
         //границы
         if (bird[i].x >= cnv.width - 50) {
            bird.splice(i, 1);
            birdLaughSoundFunc();
            life--;
         }
         if (bird[i].y >= cnv.height - 70 || bird[i].y < 0) bird[i].by = -bird[i].by;
      }
   }
   //полет часов
   function clockFly() {
      //физика
      for (let i = 0; i < clock.length; i++) {
         clock[i].x += clock[i].bx;
         clock[i].y += clock[i].by;
         //границы
         if (clock[i].x >= cnv.width + 70) {
            clearTimeout(clockTimeout);
            clockEmerg();
            clockTimeout = setTimeout(() => {
               clock.splice(i, 1);
            }, 5000);

         }
         if (clock[i].y >= cnv.height - 30 || clock[i].y < 0) clock[i].by = -clock[i].by;
      }
   }
   //полет бомбы
   function bombFly() {
      //физика
      for (let i = 0; i < bomb.length; i++) {
         bomb[i].x += bomb[i].bx;
         bomb[i].y += bomb[i].by;
         //границы
         if (bomb[i].y >= cnv.height - 100) {
            clearTimeout(bombTimeout);
            bombEmerg();
            bombboom.push({ x: bomb[i].x, y: bomb[i].y, animx: 0, animy: 0 });
            bomb.splice(i, 1);
            bird.splice(0);
            bombBoomSoundFunc();
            life--;
            break;
         }
         if (bomb[i].x >= cnv.width - 50 || bomb[i].x < 0) {
            bomb[i].bx = -bomb[i].bx;
         }
      }
   }
   //бег вора
   function vorRun() {
      //физика
      for (let i = 0; i < vor.length; i++) {
         vor[i].x -= vor[i].bx;
         //границы
         if (vor[i].x <= -70) {
            vor.splice(i, 1);
            vor.splice(i, 1);
            vorRunAwaySoundFunc();
            countShot = 0;
            break;
         }

      }
   }
   //движение прицела
   cnv.addEventListener('mousemove', function (event) {
      sight.x = event.offsetX;
      sight.y = event.offsetY;
   });


   /*///////////////////////// СТРЕЛЬБА ///////////////////////////////////*/
   //выстрел из винтовки
   cnv.addEventListener('click', function (event) {
      shotGunSoundFunc();
      //попадание в птиц
      for (let i = 0; i < bird.length; i++) {
         if (Math.abs(bird[i].x + 35 - sight.x) < 25 && Math.abs(bird[i].y + 35 - sight.y) < 25) {
            //произошло попадение
            //спрайт взрыва
            birdbuh.push({ x: bird[i].x, y: bird[i].y, animx: 0, animy: 0 });
            //помечаем птицу на удаление
            bird[i].del = 1;
         }
         //удаляем птицу
         if (bird[i].del == 1) {
            birdShotedSoundFunc();
            bird.splice(i, 1);
            counter += 1 * playDif;
         }
      }
      //попадание в часы
      for (let i = 0; i < clock.length; i++) {
         if (Math.abs(clock[i].x + 25 - sight.x) < 25 && Math.abs(clock[i].y + 25 - sight.y) < 25) {
            //произошло попадение
            //спрайт взрыва
            boom.push({ x: clock[i].x, y: clock[i].y, animx: 0, animy: 0 });
            //помечаем часы на удаление
            clock[i].del = 1;
            setTimeout(() => {
               shotRicochetSoundFunc();
            }, 200);
         }
         //удаляем часы
         if (clock[i].del == 1) {
            clock.splice(i, 1);

            clearTimeout(clockTimeout);
            clockEmerg();
            playTime += 10;
            counter += 10 * playDif;
         }
      }
      //попадание в бомбу
      for (let i = 0; i < bomb.length; i++) {
         if (Math.abs(bomb[i].x + 25 - sight.x) < 25 && Math.abs(bomb[i].y + 35 - sight.y) < 35) {
            //произошло попадение
            //спрайт взрыва
            bombboom.push({ x: bomb[i].x, y: bomb[i].y, animx: 0, animy: 0 });
            //помечаем бомбу на удаление
            bomb[i].del = 1;
            setTimeout(() => {
               shotRicochetSoundFunc();
            }, 200);
         }
         //удаляем бомбу
         if (bomb[i].del == 1) {
            bomb.splice(i, 1);
            bird.splice(0, 8);
            clock.splice(i, 1);
            bombBoomSoundFunc();
            birdShotedSoundFunc();
            clearTimeout(bombTimeout);
            bombEmerg();

            clearTimeout(clockTimeout);
            clockEmerg();
            counter += 8 * playDif;
         }
      }
      //попадание в вора
      for (let i = 0; i < vor.length; i++) {
         if (Math.abs(vor[i].x + 35 - sight.x) < 40 && Math.abs(vor[i].y + 35 - sight.y) < 40) {
            //произошло попадение
            //спрайт взрыва
            vorbuh.push({ x: vor[i].x, y: vor[i].y, animx: 0, animy: 0 });
            vor[i].del = 1;
         }
         //удаляем вора
         if (vor[i].del == 1) {
            vorShotSoundFunc();
            vor.splice(i, 1);
            countShot = 0;
            counter += 4 * playDif;
            bigGun += 5;
         }
      }
      //попадание в дымоход
      if (Math.abs(cnv.width - 85 - sight.x) < 40 && Math.abs(cnv.height - 430 - sight.y) < 40) {
         //произошло попадение
         setTimeout(() => {
            shotRicochetSoundFunc();
         }, 200);
         if (bigGun <= 2) {
            countShot++;
            if (countShot <= 1) {
               vorRunSoundFunc();
               vorEmerg();
               counter += 4 * playDif;
            }
         }
      }
   });

   //выстрел из дробовика
   cnv.addEventListener('contextmenu', function (event) {
      event.preventDefault();
      if (bigGun > 0) {
         --bigGun;
         shotGunRightSoundFunc();
         //попадание в птиц
         for (let i = 0; i < bird.length; i++) {
            if (Math.abs(bird[i].x + 35 - sight.x) < 70 && Math.abs(bird[i].y + 35 - sight.y) < 70) {
               //произошло попадение
               //спрайт взрыва
               birdbuh.push({ x: bird[i].x, y: bird[i].y, animx: 0, animy: 0 });
               //помечаем птицу на удаление
               bird[i].del = 1;
            }
            //удаляем птицу
            if (bird[i].del == 1) {
               birdShotedSoundFunc();
               bird.splice(i, 1);
               counter += 1 * playDif;
            }
         }
         //попадание в часы
         for (let i = 0; i < clock.length; i++) {
            if (Math.abs(clock[i].x + 25 - sight.x) < 25 && Math.abs(clock[i].y + 25 - sight.y) < 25) {
               //произошло попадение
               //спрайт взрыва
               boom.push({ x: clock[i].x, y: clock[i].y, animx: 0, animy: 0 });
               //помечаем часы на удаление
               clock[i].del = 1;
               setTimeout(() => {
                  shotRicochetSoundFunc();
               }, 200);
            }
            //удаляем часы
            if (clock[i].del == 1) {
               clock.splice(i, 1);

               clearTimeout(clockTimeout);
               clockEmerg();
               playTime += 5;
               counter += 5 * playDif;
            }
         }
         //попадание в бомбу
         for (let i = 0; i < bomb.length; i++) {
            if (Math.abs(bomb[i].x + 25 - sight.x) < 25 && Math.abs(bomb[i].y + 35 - sight.y) < 35) {
               //произошло попадение
               //спрайт взрыва
               bombboom.push({ x: bomb[i].x, y: bomb[i].y, animx: 0, animy: 0 });
               //помечаем бомбу на удаление
               bomb[i].del = 1;
               setTimeout(() => {
                  shotRicochetSoundFunc();
               }, 200);
            }
            //удаляем бомбу
            if (bomb[i].del == 1) {
               bomb.splice(i, 1);
               bird.splice(0, 4);
               clock.splice(i, 1);
               bombBoomSoundFunc();
               birdShotedSoundFunc();
               clearTimeout(bombTimeout);
               bombEmerg();

               clearTimeout(clockTimeout);
               clockEmerg();
               counter += 4 * playDif;
            }
         }
         //попадание в вора
         for (let i = 0; i < vor.length; i++) {
            if (Math.abs(vor[i].x + 35 - sight.x) < 50 && Math.abs(vor[i].y + 35 - sight.y) < 50) {
               //произошло попадение
               //спрайт взрыва
               vorbuh.push({ x: vor[i].x, y: vor[i].y, animx: 0, animy: 0 });
               vor[i].del = 1;
            }
            //удаляем вора
            if (vor[i].del == 1) {
               vorShotSoundFunc();
               vor.splice(i, 1);
               countShot = 0;
               counter += 2 * playDif;
               bigGun += 3;
            }
         }
         //попадание в дымоход
         if (Math.abs(cnv.width - 85 - sight.x) < 50 && Math.abs(cnv.height - 430 - sight.y) < 50) {
            //произошло попадение
            setTimeout(() => {
               shotRicochetSoundFunc();
            }, 200);
            if (bigGun <= 2) {
               countShot++;
               if (countShot <= 1) {
                  vorRunSoundFunc();
                  vorEmerg();
                  counter += 2 * playDif;
               }
            }
         }
      }
      else if (bigGun <= 0) {
         shotGunEmptySoundFunc();
      }
   });

   /*///////////////////////// ОБНОВЛЕНИЕ ИГРЫ ///////////////////////////////////*/
   //запуск игры по загрузке
   fonimg.onload = function () {
      game();
      clockEmerg();
      bombEmerg();
   }
   //анимация
   function game() {
      update();
      render();
      gameAnimation = requestAnimationFrame(game);
   }

   /*///////////////////////// ЗАПУСК ФУНКЦИЙ ///////////////////////////////////*/
   function update() {
      //появление птиц
      birdEmerg();
      //полет птиц
      birdFly();
      //полет часов
      clockFly();
      //полет бомбы
      bombFly();
      //анимация птиц
      animBird();
      //анимация попадания
      animBoom();
      //анимация попадания в птиц
      animBirdBuh();
      //анимация взрыва бомбы
      animBombBoom();
      //бег вора
      vorRun();
      //анимация бега вора
      animVor();
      //анимация взрыва вора
      animVorBuh();
      //анимация дыма из дымохода
      animhomesmoke();
      //появление дыма
      if (bigGun <= 2) {
         homesmokeEmerg();
      }
   }

   /*///////////////////////// ОТРИСОВКА ///////////////////////////////////*/
   function render() {
      //отрисовка фон
      ctx.drawImage(fonimg, 0, 0, cnv.width, cnv.height);
      //отрисовка куста2
      ctx.drawImage(kust2img, cnv.width / 2 + 15, cnv.height - 350, 100, 100);
      //отрисовка вора
      for (i in vor) {
         ctx.drawImage(vorimg, 315 * Math.floor(vor[i].animx), 352 * Math.floor(vor[i].animy), 315, 352, vor[i].x, vor[i].y, 70, 70,);
      }
      //отрисовка взрыва вора
      for (i in vorbuh) {
         ctx.drawImage(vorbuhimg, 256 * Math.floor(vorbuh[i].animx), 256 * Math.floor(vorbuh[i].animy), 256, 256, vorbuh[i].x, vorbuh[i].y, 70, 70,);
      }
      //отрисовка куста
      ctx.drawImage(kustimg, cnv.width / 2, cnv.height - 330, 100, 100);
      //отрисовка дерева 3
      ctx.drawImage(tree3img, cnv.width / 2 - 150, cnv.height - 470, 250, 220);
      //отрисовка кустаа
      ctx.drawImage(kustaimg, cnv.width / 2 - 50, cnv.height - 320, 100, 100);
      //отрисовка дыма дома
      for (i in homesmoke) {
         ctx.drawImage(vorbuhimg, 256 * Math.floor(homesmoke[i].animx), 256 * Math.floor(homesmoke[i].animy), 256, 256, homesmoke[i].x, homesmoke[i].y, 30, 180,);
      }
      //отрисовка дома
      ctx.drawImage(homeimg, cnv.width - 350, cnv.height - 450, 520, 220);
      //отрисовка дерева 2
      ctx.drawImage(tree2img, cnv.width - 400, cnv.height - 570, 300, 350);
      //отрисовка птиц
      for (i in bird) {
         ctx.drawImage(birdimg, 182 * Math.floor(bird[i].animx), 169 * Math.floor(bird[i].animy), 182, 169, bird[i].x, bird[i].y, 70, 70,);
      }
      //отрисовка часов
      for (i in clock) {
         ctx.drawImage(clockimg, clock[i].x, clock[i].y, 50, 50,);
      }
      //отрисовка бомбы
      for (i in bomb) {
         ctx.drawImage(bombimg, bomb[i].x, bomb[i].y, 50, 70,);
      }
      //отрисовка взрывов птиц
      for (i in birdbuh) {
         ctx.drawImage(birdbuhimg, 624 * Math.floor(birdbuh[i].animx), 511 * Math.floor(birdbuh[i].animy), 624, 511, birdbuh[i].x, birdbuh[i].y, 50, 50,);
      }
      //отрисовка взрывов
      for (i in boom) {
         ctx.drawImage(boomimg, 128 * Math.floor(boom[i].animx), 128 * Math.floor(boom[i].animy), 128, 128, boom[i].x, boom[i].y, 50, 50,);
      }
      //отрисовка взрыва бомбы
      for (i in bombboom) {
         ctx.drawImage(bombboomimg, 250 * Math.floor(bombboom[i].animx), 200 * Math.floor(bombboom[i].animy), 250, 200, bombboom[i].x, bombboom[i].y, 200, 340,);
      }
      //отрисовка дерева 1
      ctx.drawImage(tree1img, 0, cnv.height - 570, 300, 600);
      //отрисовка дерева 4
      ctx.drawImage(tree4img, cnv.width - 500, cnv.height - 390, 300, 470);
      //отрисовка цветов
      ctx.drawImage(flaversimg, cnv.width - 350, cnv.height - 80, 150, 100);
      //отрисовка цветов2
      ctx.drawImage(flavers2img, cnv.width - 700, cnv.height - 120, 350, 130);
      //отрисовка травы у дерева 1
      ctx.drawImage(grassimg, -40, cnv.height - 100, 400, 160);
      //отрисовка прицела
      ctx.drawImage(sightimg, sight.x, sight.y, 40, 40);
      // время игры 
      ctx.beginPath();
      ctx.font = 'bold 20px sans-serif';
      ctx.fillStyle = `${playTime > 10 ? 'orange' : 'red'}`;
      ctx.fill();
      ctx.fillText('время до конца раунда: ' + playTime, 30, 30);
      ctx.closePath();
      // счет 
      ctx.beginPath();
      ctx.font = 'bold 20px sans-serif';
      ctx.fillStyle = 'yellow';
      ctx.fill();
      ctx.fillText('счет: ' + Math.round(counter), 315, 30);
      ctx.closePath();
      // жизни 
      ctx.beginPath();
      ctx.font = 'bold 20px sans-serif';
      ctx.fillStyle = 'red';
      ctx.fill();
      ctx.fillText('жизни: ' + life, 420, 30);
      ctx.closePath();
      // количество патронов дроби 
      ctx.beginPath();
      ctx.font = 'bold 20px sans-serif';
      ctx.fillStyle = `${bigGun > 0 ? 'blue' : 'red'}`;
      ctx.fill();
      ctx.fillText('дробь: ' + `${bigGun > 0 ? bigGun : 'пусто'}`, 520, 30);
      ctx.closePath();
   }

   /*///////////////////////// РЕЗУЛЬТАТ ///////////////////////////////////*/
   //результат игры
   function result() {
      points.style.cssText = 'display: flex;';
      buttonRepeat.addEventListener('click', () => {
         points.style.cssText = 'display: none;';
         intro.style.cssText = 'display: flex;';
         location.reload();
      });

      if (localStorage.getItem('result') === null) {
         //запись массива и в localStorage
         playerArr.push({ name: playerName.value, result: Math.round(counter), difficult: gameDifficulty.value, });
         localStorage.setItem('result', JSON.stringify(playerArr));

         for (let i = 0; i < playerArr.length; i++) {
            if (playerArr[i].difficult == 100) {
               let li = document.createElement('li');
               li.style.cssText = 'color: red;'
               li.innerHTML = playerArr[i].name + ' --- набрал --- ' + playerArr[i].result + ' --- очков --- уровень: ОЧЕНЬ СЛОЖНЫЙ';
               listPoint.prepend(li);
            }
            else if (playerArr[i].difficult == 80) {
               let li = document.createElement('li');
               li.style.cssText = 'color: orange;'
               li.innerHTML = playerArr[i].name + ' --- набрал --- ' + playerArr[i].result + ' --- очков --- уровень: СЛОЖНЫЙ';
               listPoint.prepend(li);
            }
            else if (playerArr[i].difficult == 60) {
               let li = document.createElement('li');
               li.style.cssText = 'color: yellow;'
               li.innerHTML = playerArr[i].name + ' --- набрал --- ' + playerArr[i].result + ' --- очков --- уровень: СРЕДНИЙ';
               listPoint.prepend(li);
            }
            else if (playerArr[i].difficult == 40) {
               let li = document.createElement('li');
               li.style.cssText = 'color: lightgreen;'
               li.innerHTML = playerArr[i].name + ' --- набрал --- ' + playerArr[i].result + ' --- очков --- уровень: ЛЁГКИЙ';
               listPoint.prepend(li);
            }
            else if (playerArr[i].difficult == 20) {
               let li = document.createElement('li');
               li.style.cssText = 'color: green;'
               li.innerHTML = playerArr[i].name + ' --- набрал --- ' + playerArr[i].result + ' --- очков --- уровень: ОЧЕНЬ ЛЁГКИЙ';
               listPoint.prepend(li);
            }
         }
      }
      else {
         //чтение из localStorage предыдущего сохранения и запись нового
         playerArr.push(...JSON.parse(localStorage.getItem('result')), { name: playerName.value, result: Math.round(counter), difficult: gameDifficulty.value, });
         //обновление результата в localStorage
         localStorage.setItem('result', JSON.stringify(playerArr));

         for (let i = 0; i < playerArr.length; i++) {
            if (playerArr[i].difficult == 100) {
               let li = document.createElement('li');
               li.style.cssText = 'color: red;'
               li.innerHTML = playerArr[i].name + ' --- набрал --- ' + playerArr[i].result + ' --- очков --- уровень: ОЧЕНЬ СЛОЖНЫЙ';
               listPoint.prepend(li);
            }
            else if (playerArr[i].difficult == 80) {
               let li = document.createElement('li');
               li.style.cssText = 'color: orange;'
               li.innerHTML = playerArr[i].name + ' --- набрал --- ' + playerArr[i].result + ' --- очков --- уровень: СЛОЖНЫЙ';
               listPoint.prepend(li);
            }
            else if (playerArr[i].difficult == 60) {
               let li = document.createElement('li');
               li.style.cssText = 'color: yellow;'
               li.innerHTML = playerArr[i].name + ' --- набрал --- ' + playerArr[i].result + ' --- очков --- уровень: СРЕДНИЙ';
               listPoint.prepend(li);
            }
            else if (playerArr[i].difficult == 40) {
               let li = document.createElement('li');
               li.style.cssText = 'color: lightgreen;'
               li.innerHTML = playerArr[i].name + ' --- набрал --- ' + playerArr[i].result + ' --- очков --- уровень: ЛЁГКИЙ';
               listPoint.prepend(li);
            }
            else if (playerArr[i].difficult == 20) {
               let li = document.createElement('li');
               li.style.cssText = 'color: green;'
               li.innerHTML = playerArr[i].name + ' --- набрал --- ' + playerArr[i].result + ' --- очков --- уровень: ОЧЕНЬ ЛЁГКИЙ';
               listPoint.prepend(li);
            }
         }
      }
      //проверка на рекорд
      if (Math.round(counter) >= localStorage.getItem('record')) {
         record = Math.round(counter);
         bestPlayer = { name: playerName.value, result: Math.round(counter), };
         localStorage.setItem('record', JSON.stringify(record));
         localStorage.setItem('bestPlayer', JSON.stringify(bestPlayer));
         bestResult.innerHTML = bestPlayer.name + ' --- набрал --- ' + bestPlayer.result + ' --- очков';
      } else {
         record = JSON.parse(localStorage.getItem('record'));
         bestPlayer = JSON.parse(localStorage.getItem('bestPlayer'));
         localStorage.setItem('record', JSON.stringify(record));
         localStorage.setItem('bestPlayer', JSON.stringify(bestPlayer));
         bestResult.innerHTML = bestPlayer.name + ' --- набрал --- ' + bestPlayer.result + ' --- очков';
      }
   };

   // время игры
   var playEnd = setInterval(
      () => {
         playTime--;
         if (playTime <= 10) {
            timerSound.play();
         };
         if (playTime <= 0 || life <= 0) {
            clearInterval(playEnd);
            cancelAnimationFrame(gameAnimation);
            clearTimeout(clockTimeout);
            clearTimeout(bombTimeout);
            result();
            fonStopSoundFunc();
            timerSound.pause();
         }
      }, 1000);
}

