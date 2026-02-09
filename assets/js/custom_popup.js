/**
 *
 * Custom Popups
 * Открытие модальных окон
 *
 * @author      Mihail Pridannikov
 * @copyright   2025-2026, Mihail Pridannikov
 * @license MIT
 * @version     3.1.2
 * @release     January 23, 2025
 * @link        https://github.com/mihail-174/custom_popup
 *
 */

const CustomPopup = function(settings) {
    const BUTTON = document.querySelectorAll('[data-modal-popup]');
    const POPUPS = document.querySelectorAll('.popup');

    this.init = function() {
        BUTTON.forEach(button => {
            button.addEventListener('click', e => this.handlerClickOnButtons(e, button));
        });
        POPUPS.forEach(popup => {
            popup.querySelector('.popup__overlay') ? popup.querySelector('.popup__overlay').addEventListener('click', e => this.handlerOnClickOverlay(e, popup)) : null;
            popup.querySelector('.popup__close') ? popup.querySelector('.popup__close').addEventListener('click', e => this.handlerOnClickButtonClose(e, popup)) : null;
            popup.scrollTo(0, 0);
            this.calcPopupScreen(popup);
        });
        document.body.addEventListener('keydown', e => this.handlerOnClickEsc(e, POPUPS), {passive: true});
        window.addEventListener('resize', e => this.resize(e));
    }
    this.handlerClickOnButtons = function (e, button) {
        e.preventDefault();
        let id = button.getAttribute('data-modal-popup');
        this.disableScrolling();

        if (id === 'agreement') {
            let href = e.currentTarget.getAttribute('href');
            let http = new XMLHttpRequest();
            http.open('GET', href);
            http.onreadystatechange = function () {
                let doc = new DOMParser().parseFromString(this.responseText, "text/html");
                if (doc.querySelector('.page__content')) {
                    console.log(doc.querySelector('.page__content'))
                    document.querySelector('.popup-agreement .popup__content-inner').innerHTML = doc.querySelector('.page__content').innerHTML;
                }
            }
            http.send(null);
        }

        this.openPopup(document.querySelector(`.popup-${id}`));
    }
    this.handlerOnClickButtonClose = function(e, popup) {
        this.enableScrolling();
        this.closePopup(popup);
    }
    this.handlerOnClickOverlay = function(e, popup) {
        this.enableScrolling();
        this.closePopup(popup);
    }
    this.disableScrolling = function(e) {
        document.body.classList.add('js-scroll-locked');
    }
    this.enableScrolling = function(e) {
        document.body.classList.remove('js-scroll-locked');
    }
    this.openPopup = function(popup) {
        popup.classList.add('is-opened');
        popup.scrollTo(0, 0);
    }
    this.closePopup = function(popup) {
        popup.classList.remove('is-opened');
    }
    this.handlerOnClickEsc = function(e, popups) {
        popups.forEach(popup => {
            e.keyCode === 27 && this.closePopup(popup);
        });
    }
    this.resize = function() {
        POPUPS.forEach(popup => {
            this.calcPopupScreen(popup);
        });
    }
    this.calcPopupScreen = function(popup) {
        popup.classList.remove('is-screen-fit');
        popup.classList.remove('is-screen-overflow');

        if (this.getHeightPopupContent(popup) <= this.getHeightPopup(popup)) {
            popup.classList.add('is-screen-fit');
        } else {
            popup.classList.add('is-screen-overflow');
        }
    }
    this.getHeightWindow = function() {
        return window.innerHeight;
    }
    this.getHeightPopup = function(popup) {
        const inner = popup.querySelector('.popup__inner');
        const paddingTop = parseInt(getComputedStyle(inner).paddingTop),
            paddingBottom = parseInt(getComputedStyle(inner).paddingBottom);

        return this.getHeightWindow() - paddingTop - paddingBottom;
    }
    this.getHeightPopupContent = function(popup) {
        return popup.querySelector('.popup__content').scrollHeight;
    }

    this.init();
}
