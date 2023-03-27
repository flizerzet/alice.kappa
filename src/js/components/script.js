import { throttle, debounce, getDay, getMonth, getRandom } from "./functions.js";
import { Modal } from "./modules.js";


window.addEventListener('load', () => {
	setTimeout(() => {
		document.getElementById('preloader').classList.add('disappear')
	}, 1000)
	setTimeout(() => {
		document.getElementById('preloader').style.display = 'none'
	}, 1500)
})


const title = document.querySelector('.logo');
const footer = document.querySelector(".footer");
// const menu = document.querySelector('.menu');
const menuIcon = document.querySelector('.menu__icon');

const aside = document.querySelector('aside')
const mainSection = document.querySelector('.main-section')

title.style.fontSize = 35 + 'vw';
let oldFz = title.clientWidth;

if (window.scrollY > 435) {
  title.style.fontSize = 30 + "px";
}

window.addEventListener('scroll', () => {
  title.style.fontSize = oldFz / 1.3 - window.scrollY * 1.1 + "px";
  if (title.clientWidth <= 40) {
    title.style.fontSize = 30 + "px";
  }
  if (window.scrollY + window.innerHeight > document.body.scrollHeight - footer.scrollHeight) {
    menuIcon.classList.add('_footerFixed')
  } else {
    menuIcon.classList.remove('_footerFixed')
	}
	if (window.scrollY > (mainSection.clientHeight + 50)) {
		aside.classList.add('aside-fixed')
	} else {
		aside.classList.remove('aside-fixed')
	}
})

const month = document.querySelector('#month')
const year = document.querySelector('#year')

month.textContent = getMonth('eng', 'short')
year.textContent = new Date().getFullYear()


const langChanger = document.getElementById('lang-switcher')
let lsLang = localStorage.getItem('lang')

if (!lsLang) {
	localStorage.setItem('lang', 'rus')
	document.querySelectorAll(`._lang.rus`).forEach(elem => elem.style.display = 'none')
}

document.querySelectorAll(`._lang.${lsLang}`).forEach(elem => elem.style.display = 'none')

function changeLang() {
	lsLang = localStorage.getItem('lang')
	document.querySelectorAll(`._lang`).forEach(elem => elem.style.display = 'none')
	document.querySelectorAll(`._lang.${lsLang}`).forEach(elem => elem.style.display = 'block')
	localStorage.setItem('lang', lsLang === 'rus' ? 'eng' : 'rus')
}
// changeLang()

langChanger.addEventListener('click', () => {
	changeLang()
})