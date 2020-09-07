export default { 
	  MIDNIGHTBLUE : 'midnightblue',
	  GREEN: '#41a81a',
	  ORANGE: '#974806',
	  GRAYGREEN: '#b4e1d0',
	  SEAGREEN: '#00c88d',
	  LIGHTBLUE: '#50e1dd',
	  DARKPURPLE: '#0e0029',
	  PURPLE: '#4A0837',
	  MAUVE: '#7e172b',
	  LIGHTMAUVE: '#f4838A',
	  BLUE: '#1575c8',
	  GERM :'germ',
	  GERMS: 'germs',
	  LEUKS: 'leuks',
	  BUBBLE :'bubble',
	  BUBBLEPRESS: 'bubblePress',
	  LEUK : 'leuk',
	  DESTCONTROL : 'destControl',
	  GAMEOVER: 'gameOver',
	  WIN: 'win',
	  LOSE: 'lose',
	  CONTROLS: 'controls',
	  STAGING: 'staging',
	  SIZES:{
	  	1: 6,
	  	2: 12,
	  	3: 18
	  },
	  MONTHS: { 0: "January", 1: "February", 2: 'March', 3: "April", 4:"May", 5:"June", 6: "July", 7: "August", 8: "September", 9: "October", 10: "November", 11: "December" },
	  DAYS: { 0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday" },
	  tAlert: function( val, freq ){
	  	if( Math.random() < freq ) alert( val );
	  }
}
