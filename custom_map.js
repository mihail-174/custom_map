/**
 *
 * Custom Map
 * Кастомный вывод карты.
 *
 * @author      Mihail Pridannikov
 * @copyright   2025-2026, Mihail Pridannikov
 * @license MIT
 * @version     2.0.1
 * @release     January 13, 2026
 * @link        https://github.com/mihail-174/custom_map
 *
 */

window.CustomMaps = function(settingsCustom) {
    this.deepMergeObjects = function (obj1, obj2) {
        const result = {};
        for (const key in obj2) {
            if (obj2.hasOwnProperty(key)) {
                if (typeof obj2[key] === "object" && obj1.hasOwnProperty(key) && typeof obj1[key] === "object") {
                    result[key] = this.deepMergeObjects(obj1[key], obj2[key]);
                } else {
                    result[key] = obj2[key];
                }
            }
        }
        for (const key in obj1) {
            if (obj1.hasOwnProperty(key) && !result.hasOwnProperty(key)) {
                if (typeof obj1[key] === "object") {
                    result[key] = this.deepMergeObjects(obj1[key], {});
                } else {
                    result[key] = obj1[key];
                }
            }
        }
        return result;
    }

    const DEFAULT_SETTINGS = {
        clusterer: false,
        selector: 'map',
        zoom: 16,
        // coords: [55.050432, 60.109599],
        // coordsList: [
        //     {
        //         name: 'Миасс',
        //         title: 'miass',
        //         coords: [55.050432, 60.109599],
        //         balloonContent: 'Содержимое всплывающей подсказки',
        //     }
        // ],
        // controls: ["zoomControl", "fullscreenControl"],
        balloonContent: '',
        iconImageHref: 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPScxLjEnIGlkPSdMYXllcl8xJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJyB4PScwcHgnIHk9JzBweCcgdmlld0JveD0nMCAwIDUxMS45OTkgNTExLjk5OScgc3R5bGU9J2VuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTExLjk5OSA1MTEuOTk5OycgeG1sOnNwYWNlPSdwcmVzZXJ2ZSc+PHBhdGggc3R5bGU9J2ZpbGw6I0VFMzg0MDsnIGQ9J000NTQuODQ4LDE5OC44NDhjMCwxNTkuMjI1LTE3OS43NTEsMzA2LjY4OS0xNzkuNzUxLDMwNi42ODljLTEwLjUwMyw4LjYxNy0yNy42OTIsOC42MTctMzguMTk1LDAgYzAsMC0xNzkuNzUxLTE0Ny40NjQtMTc5Ljc1MS0zMDYuNjg5QzU3LjE1Myw4OS4wMjcsMTQ2LjE4LDAsMjU2LDBTNDU0Ljg0OCw4OS4wMjcsNDU0Ljg0OCwxOTguODQ4eicvPjxwYXRoIHN0eWxlPSdmaWxsOiNGRkUxRDY7JyBkPSdNMjU2LDI5OC44OWMtNTUuMTY0LDAtMTAwLjA0MS00NC44NzktMTAwLjA0MS0xMDAuMDQxUzIwMC44MzgsOTguODA2LDI1Niw5OC44MDYgczEwMC4wNDEsNDQuODc5LDEwMC4wNDEsMTAwLjA0MVMzMTEuMTY0LDI5OC44OSwyNTYsMjk4Ljg5eicvPjwvc3ZnPg==',
        iconImageSize: [24, 24],
        iconImageOffset: [0, 0],
    }

    let settings = this.deepMergeObjects(DEFAULT_SETTINGS, settingsCustom);

    this.init = function () {

        if (typeof ymaps !== "undefined") {
            ymaps.ready(() => {
                const map = new ymaps.Map(settings.selector, {
                    center: [],
                    zoom: settings.zoom,
                    controls: settings.controls || ["zoomControl", "fullscreenControl"]
                }, {
                    searchControlProvider: 'yandex#search',
                    suppressMapOpenBlock: false,
                });

                if (typeof settings.coords === 'object') {
                    const placemarks = new ymaps.Placemark(settings.coords, {
                        balloonContent: settings.balloonContent,
                    }, {
                        iconLayout: 'default#image',
                        iconImageHref: settings.iconImageHref,
                        iconImageSize: settings.iconImageSize,
                        iconImageOffset: settings.iconImageOffset,
                        balloonCloseButton: true,
                        hideIconOnBalloonOpen: false,
                    });
                    map.setCenter(settings.coords, settings.zoom);
                    map.geoObjects.add(placemarks);
                } else {

                    let pointsList = [];
                    settings.coordsList.map((item) => {
                        pointsList.push(item.coords);
                    });

                    if (settings.clusters) {

                        // Создание кластеризатора
                        const clusterer = new ymaps.Clusterer({
                            preset: "islands#invertedDarkBlueClusterIcons",
                            groupByCoordinates: true,
                            clusterDisableClickZoom: true,
                            hasBalloon: false,
                            hasHint: false,
                            minClusterSize: 1,
                            // clusterHideIconOnBalloonOpen: false,
                            // geoObjectHideIconOnBalloonOpen: false
                        });

                        const placemarks = settings.coordsList.map((point) => {
                            return new ymaps.Placemark(
                                point.coords
                            );
                        });

                        clusterer.add(placemarks);
                        map.geoObjects.add(clusterer);

                    } else {

                        const placemarks = settings.coordsList.map((point) => {
                            return new ymaps.Placemark(
                                point.coords,
                                {
                                    balloonContent: point.balloonContent,
                                }, {
                                    iconLayout: 'default#image',
                                    iconImageHref: settings.iconImageHref,
                                    iconImageSize: settings.iconImageSize,
                                    iconImageOffset: settings.iconImageOffset,
                                    balloonCloseButton: true,
                                    hideIconOnBalloonOpen: false,
                                }
                            );
                        });

                        Object.values(placemarks).map((item) => {
                            map.geoObjects.add(item);
                        });

                    }

                    if (pointsList.length === 1 || this.allElementsSame(pointsList)) {
                        map.setCenter(pointsList[0], 16);
                    } else {
                        map.setBounds(ymaps.util.bounds.fromPoints(pointsList));
                    }

                    window.addEventListener('resize', (e) => {
                        map.setBounds(ymaps.util.bounds.fromPoints(pointsList));
                    });
                }

                map.behaviors.disable("scrollZoom");
            });
        }

    }

     this.allElementsSame = function(arr) {
        if (arr.length === 0) {
            return true;
        }
        const firstElement = arr[0];
        for (const element of arr) {
            if (JSON.stringify(element) !== JSON.stringify(firstElement)) {
                return false;
            }
        }
        return true;
    }

    this.init();
}