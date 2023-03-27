(() => {
    "use strict";
    const body = document.body;
    (function() {
        let currentBrowser;
        if (navigator.userAgent.indexOf("Firefox") > -1) currentBrowser = "firefox"; else if (navigator.userAgent.indexOf("Opera") > -1) currentBrowser = "opera"; else if (navigator.userAgent.indexOf("Trident") > -1) currentBrowser = "explorer"; else if (navigator.userAgent.indexOf("Edge") > -1) currentBrowser = "edge"; else if (navigator.userAgent.indexOf("Chrome") > -1) currentBrowser = "chrome"; else if (navigator.userAgent.indexOf("Safari") > -1) currentBrowser = "safari"; else currentBrowser = "unknown";
        console.log("You are using: " + currentBrowser);
        document.documentElement.classList.add(currentBrowser);
    })();
    let isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
        }
    };
    (function checkMobile() {
        if (isMobile.any()) document.documentElement.classList.add("_mobile");
    })();
    (function isWebp() {
        function testWebP(callback) {
            var webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            if (true === support) document.documentElement.classList.add("_webp"); else document.documentElement.classList.add("_no-webp");
        }));
    })();
    function menuInit() {
        let burger = document.querySelector(".menu__icon");
        let burgerMob = document.querySelector(".menu-icon");
        let menu = document.querySelector(".menu");
        if (burgerMob && menu) burgerMob.onclick = () => {
            burgerMob.classList.toggle("_active");
            menu.classList.toggle("_active");
            body.classList.toggle("_locked");
        };
        if (burger && menu) {
            burger.onclick = () => {
                burger.classList.toggle("_active");
                menu.classList.toggle("_active");
            };
            menu.querySelectorAll(".menu__link").forEach((link => {
                link.addEventListener("click", (e => {
                    if (e.target.closest(".menu__item")) {
                        burger.classList.remove("_active");
                        menu.classList.remove("_active");
                    }
                }));
            }));
        }
    }
    function daInit() {
        "use strict";
        (function() {
            let originalPositions = [];
            let daElements = document.querySelectorAll("[data-da]");
            let daElementsArray = [];
            let daMatchMedia = [];
            if (daElements.length > 0) {
                let number = 0;
                for (let index = 0; index < daElements.length; index++) {
                    const daElement = daElements[index];
                    const daMove = daElement.getAttribute("data-da");
                    if ("" != daMove) {
                        const daArray = daMove.split(",");
                        const daPlace = daArray[1] ? daArray[1].trim() : "last";
                        const daBreakpoint = daArray[2] ? daArray[2].trim() : "767";
                        const daType = "min" === daArray[3] ? daArray[3].trim() : "max";
                        const daDestination = document.querySelector("." + daArray[0].trim());
                        if (daArray.length > 0 && daDestination) {
                            daElement.setAttribute("data-da-index", number);
                            originalPositions[number] = {
                                parent: daElement.parentNode,
                                index: indexInParent(daElement)
                            };
                            daElementsArray[number] = {
                                element: daElement,
                                destination: document.querySelector("." + daArray[0].trim()),
                                place: daPlace,
                                breakpoint: daBreakpoint,
                                type: daType
                            };
                            number++;
                        }
                    }
                }
                dynamicAdaptSort(daElementsArray);
                for (let index = 0; index < daElementsArray.length; index++) {
                    const el = daElementsArray[index];
                    const daBreakpoint = el.breakpoint;
                    const daType = el.type;
                    daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
                    daMatchMedia[index].addListener(dynamicAdapt);
                }
            }
            function dynamicAdapt(e) {
                for (let index = 0; index < daElementsArray.length; index++) {
                    const el = daElementsArray[index];
                    const daElement = el.element;
                    const daDestination = el.destination;
                    const daPlace = el.place;
                    const daBreakpoint = el.breakpoint;
                    const daClassName = "_dynamic_adapt_" + daBreakpoint;
                    if (daMatchMedia[index].matches) {
                        if (!daElement.classList.contains(daClassName)) {
                            let actualIndex = indexOfElements(daDestination)[daPlace];
                            if ("first" === daPlace) actualIndex = indexOfElements(daDestination)[0]; else if ("last" === daPlace) actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
                            daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
                            daElement.classList.add(daClassName);
                        }
                    } else if (daElement.classList.contains(daClassName)) {
                        dynamicAdaptBack(daElement);
                        daElement.classList.remove(daClassName);
                    }
                }
            }
            dynamicAdapt();
            function dynamicAdaptBack(el) {
                const daIndex = el.getAttribute("data-da-index");
                const originalPlace = originalPositions[daIndex];
                const parentPlace = originalPlace["parent"];
                const indexPlace = originalPlace["index"];
                const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
                parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
            }
            function indexInParent(el) {
                var children = Array.prototype.slice.call(el.parentNode.children);
                return children.indexOf(el);
            }
            function indexOfElements(parent, back) {
                const children = parent.children;
                const childrenArray = [];
                for (let i = 0; i < children.length; i++) {
                    const childrenElement = children[i];
                    if (back) childrenArray.push(i); else if (null == childrenElement.getAttribute("data-da")) childrenArray.push(i);
                }
                return childrenArray;
            }
            function dynamicAdaptSort(arr) {
                arr.sort((function(a, b) {
                    if (a.breakpoint > b.breakpoint) return -1; else return 1;
                }));
                arr.sort((function(a, b) {
                    if (a.place > b.place) return 1; else return -1;
                }));
            }
        })();
    }
    function initSwitcher() {
        const switcher = document.querySelector(".theme-switcher");
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        switcher.setAttribute("value", isDark ? "_dark" : "_light");
        let colorScheme = localStorage.getItem("scheme");
        if (!colorScheme) localStorage.setItem("scheme", isDark ? "_dark" : "_light");
        if (colorScheme) {
            switcher.setAttribute("value", colorScheme);
            document.documentElement.classList.remove("_light", "_dark");
            document.documentElement.classList.add(colorScheme);
        }
        function setTheme(theme) {
            document.documentElement.classList.remove("_light", "_dark");
            document.documentElement.classList.add("_dark" === theme ? "_light" : "_dark");
            switcher.setAttribute("value", "_dark" === theme ? "_light" : "_dark");
            localStorage.removeItem("scheme");
            colorScheme = localStorage.setItem("scheme", switcher.getAttribute("value"));
        }
        switcher.addEventListener("click", (event => {
            console.log(event.target.closest(".theme-switcher").getAttribute("value"));
            setTheme(event.target.closest(".theme-switcher").getAttribute("value"));
        }));
    }
    const getMonth = (lang = "eng", format = "full") => {
        let month;
        if ("short" === format) if ("rus" === lang) {
            const months = [ "Янв", "Фев", "Мар", "Апр", "Май", "Июня", "Июля", "Авг", "Сен", "Окт", "Ноя", "Дек" ];
            month = months[(new Date).getMonth()];
        } else {
            const months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
            month = months[(new Date).getMonth()];
        } else if ("rus" === lang) {
            const months = [ "Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря" ];
            month = months[(new Date).getMonth()];
        } else {
            const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
            month = months[(new Date).getMonth()];
        }
        return month;
    };
    window.addEventListener("load", (() => {
        setTimeout((() => {
            document.getElementById("preloader").classList.add("disappear");
            document.body.classList.remove("_locked");
        }), 1e3);
        setTimeout((() => {
            document.getElementById("preloader").style.display = "none";
        }), 1500);
    }));
    const title = document.querySelector(".logo");
    const footer = document.querySelector(".footer");
    const menuIcon = document.querySelector(".menu__icon");
    const aside = document.querySelector("aside");
    const mainSection = document.querySelector(".main-section");
    title.style.fontSize = 35 + "vw";
    let oldFz = title.clientWidth;
    if (window.scrollY > 435) title.style.fontSize = 30 + "px";
    window.addEventListener("scroll", (() => {
        title.style.fontSize = oldFz / 1.3 - 1.1 * window.scrollY + "px";
        if (title.clientWidth <= 40) title.style.fontSize = 30 + "px";
        if (window.scrollY + window.innerHeight > document.body.scrollHeight - footer.scrollHeight) menuIcon.classList.add("_footerFixed"); else menuIcon.classList.remove("_footerFixed");
        if (window.scrollY > mainSection.clientHeight + 50) aside.classList.add("aside-fixed"); else aside.classList.remove("aside-fixed");
    }));
    const month = document.querySelector("#month");
    const year = document.querySelector("#year");
    month.textContent = getMonth("eng", "short");
    year.textContent = (new Date).getFullYear();
    const langChanger = document.getElementById("lang-switcher");
    let lsLang = localStorage.getItem("lang");
    if (!lsLang) {
        localStorage.setItem("lang", "rus");
        document.querySelectorAll(`._lang.rus`).forEach((elem => elem.style.display = "none"));
    }
    document.querySelectorAll(`._lang.${lsLang}`).forEach((elem => elem.style.display = "none"));
    function changeLang() {
        lsLang = localStorage.getItem("lang");
        document.querySelectorAll(`._lang`).forEach((elem => elem.style.display = "none"));
        document.querySelectorAll(`._lang.${lsLang}`).forEach((elem => elem.style.display = "block"));
        localStorage.setItem("lang", "rus" === lsLang ? "eng" : "rus");
    }
    langChanger.addEventListener("click", (() => {
        changeLang();
    }));
    menuInit();
    daInit();
    initSwitcher();
})();