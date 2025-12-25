let distances = [
    { city: "Versailles", dist: 21 },
    { city: "Amiens", dist: 140 },
    { city: "Le Havre", dist: 192 },
    { city: "Lille", dist: 221 },
    { city: "Bruxelles", dist: 330 },
    { city: "Nantes", dist: 384 },
    { city: "Londres", dist: 466 },
    { city: "Strasbourg", dist: 489 },
    { city: "Amsterdam", dist: 508 },
    { city: "Brest", dist: 591 },
    { city: "Zurich", dist: 655 },
    { city: "Toulouse", dist: 677 },
    { city: "Marseilles", dist: 776 },
    { city: "Munich", dist: 840 },
    { city: "Perpignan", dist: 850 },
    { city: "Milan", dist: 905 },
    { city: "Nice", dist: 932 },
    { city: "Barcelone", dist: 1035 },
    { city: "Madrid", dist: 1275 },
    { city: "Rome", dist: 1423 },
    { city: "Budapest", dist: 1575 },
    { city: "Lisbonne", dist: 1735 },
    { city: "Stockolm", dist: 1877 },
    { city: "Alger", dist: 1930 },
    { city: "Seville", dist: 2020 },
    { city: "Palerme", dist: 2321 },
    { city: "Casablanca", dist: 2521 },
    { city: "Helsinki", dist: 2655 },
    { city: "Istanbul", dist: 2734 },
    { city: "Moscou", dist: 2852 },
    { city: "Tenerife", dist: 3600 },
    { city: "Beyrouth", dist: 4200 },
    { city: "Bagdad", dist: 4900 },
    { city: "Le Caire", dist: 5200 },
    { city: "Dakar", dist: 5300 },
    { city: "Dubaï", dist: 6777 },
    { city: "Kinshasa", dist: 8600 },
    { city: "Nairobi", dist: 10200 },
    { city: "Cape Town", dist: 12678 },
]
const defaultZoom = window.innerWidth <= 768 ? 11 : 12;


// PAGE 1

function showPage1(results) {

    let page = document.getElementById('page-1');
    page.innerHTML = `
            <div>Vous avez parcouru <div id="km-parcours" class="inline">0</div> km en 2025</br>(soit <div
                    id="km-jours" class="inline">0</div> km par jour en moyenne) </div>
            <div id="ville-atteinte"></div>
            <div id="villes-panneaux">
                <div class="barre-panneau"></div> 
                <div class="panneau" id="ville-2"></div>
            </div>`;

    let totalDistance = results.totalDistance;

    // increase the value from 0 to total distance
    let currentDistance = 0;
    let interval = setInterval(() => {
        currentDistance += totalDistance / 100;
        document.getElementById('km-parcours').innerText = currentDistance.toFixed(0);
        if (currentDistance >= totalDistance) {
            document.getElementById('km-parcours').innerText = totalDistance.toFixed(0);
            clearInterval(interval);
        }
    }, 20);

    // km per day
    let kmDays = totalDistance / 365
    let currentKmDays = 0;
    let intervalKmDays = setInterval(() => {
        currentKmDays += kmDays / 100;
        document.getElementById('km-jours').innerText = currentKmDays.toFixed(2);
        if (currentKmDays >= kmDays) {
            document.getElementById('km-jours').innerText = kmDays.toFixed(2);

            clearInterval(intervalKmDays);
        }
    }, 20);


    // compute the furhtest city reached (array is sorted in the order of the distances)
    let furthestCity = "";
    for (let i = 0; i < distances.length; i++) {
        if (totalDistance < distances[i].dist) {
            furthestCity = distances[i].city;
            break;
        }
    }
    if (furthestCity != "") {
        document.getElementById('ville-atteinte').innerText = `C'est plus qu'un trajet entre Paris et ${furthestCity} ! `;
        document.getElementById('ville-2').innerText = furthestCity;
    } else {
        document.getElementById('ville-2').innerText = "Paris";
    }
    // in 1s
    setTimeout(() => {
        document.getElementById('villes-panneaux').style.marginBottom = "0vh";
    }, 500);

}


// PAGE 2

function showPage2(results) {

    let page = document.getElementById('page-2');
    page.innerHTML = `
        <div id="stats-grid">
        <div class="item-name">Distance parcourue</div> <div class="item-value">${results.totalDistance.toFixed(2)} km</div>
        <div class="item-name">Durée totale à Vélib</div> <div class="item-value">${(results.totalMinutes / 60).toFixed(0)} h ${(results.totalMinutes % 60).toFixed(0)} min</div>
        <div class="item-name">Nombre de trajets</div> <div class="item-value">${results.nbTrips} trajets</div>
        <div class="item-name">Nombre de jours avec au moins un trajet</div> <div class="item-value">${results.nbDaysWithTrips} jours</div>
        <div class="item-name">Nombre maximum du jours consecutifs</div> <div class="item-value">${results.maxStreak} jours</div>
        <div class="item-name">Distance maximum en une journée</div> <div class="item-value">${results.maxDistanceInADay.toFixed(2)} km</div>
        </div>
        `;
}


// PAGE 3

function showPage3(results) {
    let page = document.getElementById('page-3');
    page.innerHTML = `
    <div id="page3-container">
        <div class="page3-left">
            <div class="thermometer-container">
                    <div class="thermometer">
                        <div class="progress" id="progress"></div>
                    </div>
                    <div id="value-bar">
                        <div id="value-n">0%</div> des kilomètres ont été effectués en Vélib électrique
                    </div>
                    <div class="label" style="bottom:350px">
                        <div class="label-text">Énorme flemmard.e</div>
                        <div class="thick"></div>
                    </div>
                    <div class="label" style="bottom:280px">
                        <div class="label-text">Flemmard.e</div>
                        <div class="thick"></div>
                    </div>
                    <div class="label" style="bottom:210px">
                        <div class="label-text">Pépére/Mémére</div>
                        <div class="thick"></div>
                    </div>
                    <div class="label" style="bottom:140px">
                        <div class="label-text">Aventurier.e</div>
                        <div class="thick"></div>
                    </div>
                    <div class="label" style="bottom:70px">
                        <div class="label-text">Sporti.f.ve</div>
                        <div class="thick"></div>
                    </div>
                    <div class="label" style="bottom:0px">
                        <div class="label-text">Warrior</div>
                        <div class="thick"></div>
                    </div>
                </div>
            </div>
        
        <div class="page3-right">
                <div class="speedometer-title">Vitesse moyenne</div>
            <div class="speedometer-wrapper">
                <svg class="speedometer" viewBox="0 0 200 120" id="speedo-mech">
                    <path d="M 20 100 A 80 80 0 0 1 180 100" 
                          fill="none" 
                          stroke="#e3e3e3ff" 
                          stroke-width="10" 
                          stroke-linecap="round"/>
                    <path d="M 20 100 A 80 80 0 0 1 180 100" 
                          fill="none" 
                          stroke="url(#gradient-mech)" 
                          stroke-width="15" 
                          stroke-dasharray="251.2"
                          stroke-dashoffset="251.2"
                          id="progress-mech"
                          stroke-linecap="round"/>
                    <defs>
                        <linearGradient id="gradient-mech" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style="stop-color:#0b3806;stop-opacity:1" />
                            <stop offset="30%" style="stop-color:#22bd11;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#eeff00;stop-opacity:1" />
                        </linearGradient>
                    </defs>
                    <line x1="100" y1="100" x2="100" y2="40" 
                          stroke="#fff" 
                          stroke-width="3" 
                          id="needle-mech"
                          style="transform-origin: 100px 100px; transform: rotate(-90deg);"/>
                    <circle cx="100" cy="100" r="8" fill="#fff"/>
                </svg>
                <div class="speedometer-text">Mécanique : <div class="speed-value inline" id="speed-mech">0 km/h</div></div>
            </div>
            
            <div class="speedometer-wrapper">
                <svg class="speedometer" viewBox="0 0 200 120" id="speedo-elec">
                    <path d="M 20 100 A 80 80 0 0 1 180 100" 
                          fill="none" 
                          stroke="#e3e3e3ff" 
                          stroke-width="10" 
                          stroke-linecap="round"/>
                    <path d="M 20 100 A 80 80 0 0 1 180 100" 
                          fill="none" 
                          stroke="url(#gradient-elec)" 
                          stroke-width="15" 
                          stroke-linecap="round"
                          stroke-dasharray="251.2"
                          stroke-dashoffset="251.2"
                          id="progress-elec"/>
                    <defs>
                        <linearGradient id="gradient-elec" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style="stop-color:#072136;stop-opacity:1" />
                            <stop offset="30%" style="stop-color:#0986eb;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#5cffec;stop-opacity:1" />
                        </linearGradient>
                    </defs>
                    <line x1="100" y1="100" x2="100" y2="40" 
                          stroke="#e3e3e3ff" 
                          stroke-width="3" 
                          stroke-linecap="round"
                          id="needle-elec"
                          style="transform-origin: 100px 100px; transform: rotate(-90deg);"/>
                    <circle cx="100" cy="100" r="8" fill="#e3e3e3ff"/>
                </svg>
                <div class="speedometer-text">Électrique : <div class="speed-value inline" id="speed-elec">0 km/h</div></div>
            </div>
        </div>
    </div>`;


    // PAGE 3
    let percentElectric = results.totalDistanceElec / results.totalDistance * 100;
    // round
    document.getElementById("value-bar").style.marginTop = "300px";
    document.getElementById("progress").style.height = "0%";

    percentElectric = Math.round(percentElectric);
    //after 1 s
    setTimeout(() => {
        let currentPercent = 0;
        if (percentElectric == 0) {
            intervalPercent = 10;
        } else {
            timebyPercent = 2000 / percentElectric;
        }
        let intervalPercent = setInterval(() => {
            currentPercent += 1;
            document.getElementById("value-n").textContent = currentPercent + "%";
            if (currentPercent >= percentElectric) {
                clearInterval(intervalPercent);
            }
        }, timebyPercent);
        document.getElementById("progress").style.height = percentElectric + "%";
        const marginTop = 300 - 3 * percentElectric;
        document.getElementById("value-bar").style.marginTop = marginTop + "px";
    }, 100);


    setTimeout(() => {
        animateSpeedometer('mech', results.avgSpeedMech);
        animateSpeedometer('elec', results.avgSpeedElec);
    }, 500);

}

function animateSpeedometer(type, targetSpeed) {
    const displaySpeed = Math.min(targetSpeed, 25);
    const maxSpeed = 25;
    const targetAngle = -90 + (displaySpeed / maxSpeed) * 180;
    const arcLength = 251.2;
    const targetOffset = arcLength - (displaySpeed / maxSpeed) * arcLength;

    const needle = document.getElementById(`needle-${type}`);
    const progressArc = document.getElementById(`progress-${type}`);
    const speedValue = document.getElementById(`speed-${type}`);

    // Fonction easing ease-out (décélération)
    const easeOut = (t) => {
        return 1 - Math.pow(1 - t, 3);
    };

    const duration = 2000; // 2 secondes
    const startTime = Date.now();

    const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOut(progress);

        const currentAngle = -90 + (targetAngle + 90) * easedProgress;
        const currentOffset = arcLength - (arcLength - targetOffset) * easedProgress;
        const currentSpeed = displaySpeed * easedProgress;

        needle.style.transform = `rotate(${currentAngle}deg)`;
        progressArc.style.strokeDashoffset = currentOffset;
        speedValue.textContent = `${currentSpeed.toFixed(1)} km/h`;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            needle.style.transform = `rotate(${targetAngle}deg)`;
            progressArc.style.strokeDashoffset = targetOffset;
            speedValue.textContent = `${displaySpeed.toFixed(1)} km/h`;
        }
    };

    requestAnimationFrame(animate);
}


// PAGE 4

function interpolateColor(value, minValue, maxValue) {
    const ratio = (maxValue - value) / (maxValue - minValue);
    const r = Math.round(255);
    const g = Math.round(255 * (1 - ratio) + 65 * ratio); 
    const b = Math.round(50);
    return `rgba(${r}, ${g}, ${b}, 0.9)`;
}

let months_short = ["Jan", "Fev", "Mar", "Avr", "Mai", "Juin", "Juil", "Aout", "Sep", "Oct", "Nov", "Dec"];


let favorite_season;
function showPage4(results) {
    let page = document.getElementById('page-4');
    page.innerHTML = `
        
            <div id="chart-months" class="chart">

            </div>
            <div class="chart-legend">Votre saison préférée pour la
                bicyclette, c'est <div id="saison-favorite" class="emph inline"></div>.
            </div>
    `;


    let months = Object.keys(results.kmPerMonth);
    months = months.reverse();
    let kmTotal = months.map(month => (results.kmPerMonth[month].elec + results.kmPerMonth[month].mech) / 1000);

    // Generate colors based on data values
    let colors_months = kmTotal.map(value => interpolateColor(value, Math.min(...kmTotal), Math.max(...kmTotal)));

    // let months_str = months.map(month => [months_short[parseInt(month.split('-')[1])], month.split('-')[0]]);
    let months_str = months.map(month => [months_short[parseInt(month.split('-')[1])]]);

    let kmSeasons = [0, 0, 0, 0];
    months.forEach((month, i) => {
        let month_num = parseInt(month.split('-')[1]);
        if (month_num >= 3 && month_num <= 5) {
            kmSeasons[0] += kmTotal[i]; // Printemps
        } else if (month_num >= 6 && month_num <= 8) {
            kmSeasons[1] += kmTotal[i]; // Ete
        } else if (month_num >= 9 && month_num <= 11) {
            kmSeasons[2] += kmTotal[i]; // Automne
        } else {
            kmSeasons[3] += kmTotal[i]; // Hiver
        }
    });

    let maxSeason = Math.max(...kmSeasons);
    let seasonFavorite = "";
    if (kmSeasons[0] == maxSeason) {
        seasonFavorite = "le printemps";
    } else if (kmSeasons[1] == maxSeason) {
        seasonFavorite = "l'été";
    } else if (kmSeasons[2] == maxSeason) {
        seasonFavorite = "l'automne";
    } else {
        seasonFavorite = "l'hiver";
    }
    favorite_season = seasonFavorite;
    document.getElementById('saison-favorite').innerText = seasonFavorite;


    var options = {
        series: [{
            name: 'Distance parcourue',
            data: kmTotal
        }],
        chart: {
            type: 'bar',
            height: 400,
            stacked: true,
            events: {
            }
        },
        colors: colors_months,
        plotOptions: {
            bar: {
                // horizontal: false,
                distributed: true,
                columnWidth: '90%',
            },

        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: months_str,
            labels: {
                // rotate: -90,

                style: {
                    colors: '#FFFFFF' 
                }
            }
        },
        legend: {
            show: false
        },
        yaxis: {
            title: {
                text: 'Distance (km)',

                style: {
                    fontSize: '14px',
                    color: '#FFFFFF' 
                }
            },
            labels: {
                formatter: function (value) {
                    return value.toFixed(0) + ' km';
                },
                style: {
                    fontSize: '14px',
                    colors: '#FFFFFF' 
                }
            }

        },
        animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
            animateGradually: {
                enabled: true,
                delay: 150
            },
            dynamicAnimation: {
                enabled: true,
                speed: 1000
            }
        },
        tooltip: {
            theme: 'dark', 
            style: {
                fontSize: '12px',
                fontFamily: undefined,
            },
            fillSeriesColor: false, 
            backdropColor: '#FFFFFF' 
        }
    };


    var chart = new ApexCharts(document.querySelector("#chart-months"), options);
    chart.render();

}

// PAGE 5

function showPage5(results) {
    let page = document.getElementById('page-5');
    page.innerHTML = `
            <div id="buttons-months">
            </div>
            <div id="map-months" class="map"></div>
    `;



    let months = Object.keys(results.kmPerMonth);
    //reverse months
    months = months.reverse();
    let months_str = months.map(month => [months_short[parseInt(month.split('-')[1])], month.split('-')[0]]);


    let trajets_by_months = {}
    months.forEach(month => {
        trajets_by_months[month] = [];
    });

    results.courses.forEach(course => {
        let month = new Date(course.startDate).getFullYear() + "-" + new Date(course.startDate).getMonth();
        if (!trajets_by_months[month]) {
            return
        }
        trajets_by_months[month].push(course);
    });



    var map = L.map(`map-months`).setView([48.8566, 2.3522], defaultZoom); // Paris coordinates


    let dark_layer = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_dark/{z}/{x}/{y}{r}.{ext}', {
        minZoom: 11,
        maxZoom: 15,
        attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: 'png'
    })


    dark_layer.addTo(map);




    // add buttons
    let button_div = document.getElementById('buttons-months');
    let first_button_div = document.createElement('div');
    first_button_div.className = 'six-months';

    let list_polylines = [];
    let current_color = 'yellow';
    for (let i = 0; i < 6; i++) {
        let button = document.createElement('button');
        button.className = 'button-month';
        button.innerText = months_str[i][0]; // + " " + months_str[i][1]
        button.addEventListener('mouseover', () => {
            list_polylines.forEach(polyline => {
                map.removeLayer(polyline);
            });
            trajets_by_months[months[i]].forEach(course => {
                let startStation = results.stationsList[course.departureStationId];
                let endStation = results.stationsList[course.arrivalStationId];
                if (!startStation || !endStation) {
                    return;
                }
                let polyline = L.polyline([
                    [startStation.lat, startStation.lon],
                    [endStation.lat, endStation.lon]
                ], {
                    color: current_color,
                    opacity: 0.7,
                    className: 'animated-dots',
                    zIndexOffset: 1
                }).addTo(map);
                list_polylines.push(polyline);

            });
            // remove active from other buttons
            document.querySelectorAll('.button-month').forEach(button => {
                button.classList.remove('active');
            });
            button.classList.add('active');
        });
        first_button_div.appendChild(button);
    }

    let second_button_div = document.createElement('div');
    second_button_div.className = 'six-months';

    for (let i = 6; i < 12; i++) {
        let button = document.createElement('button');
        button.className = 'button-month';
        button.innerText = months_str[i][0] //+ " " + months_str[i][1]
        button.addEventListener('mouseover', () => {
            list_polylines.forEach(polyline => {
                map.removeLayer(polyline);
            });
            trajets_by_months[months[i]].forEach(course => {
                let startStation = results.stationsList[course.departureStationId];
                let endStation = results.stationsList[course.arrivalStationId];
                if (!startStation || !endStation) {
                    return;
                }
                let polyline = L.polyline([
                    [startStation.lat, startStation.lon],
                    [endStation.lat, endStation.lon]
                ], {
                    color: current_color,
                    opacity: 0.7,
                    className: 'animated-dots',
                    zIndexOffset: 1
                }).addTo(map);
                list_polylines.push(polyline);
            });

            document.querySelectorAll('.button-month').forEach(button => {
                button.classList.remove('active');
            });
            button.classList.add('active');
        });
        second_button_div.appendChild(button);
    }

    button_div.appendChild(first_button_div);
    button_div.appendChild(second_button_div);

    document.querySelectorAll('.button-month')[11].dispatchEvent(new Event('mouseover'));


    // refresh
    map.invalidateSize();

}

// PAGE 6

let favorite_day;

function showPage6(results) {
    let page = document.getElementById('page-6');
    page.innerHTML = `
            <div id="chart-days" class="chart">

            </div>
            <div class="chart-legend">Votre jour favori pour pédaler est le <div id="jour-favorite" class="emph inline"></div>.
            </div>
    `;

    // Page 6 : chart of kms per day of the week
    let kmPerDay = results.kmPerDay;
    let order = [1, 2, 3, 4, 5, 6, 0];
    let kmPerDayOrdered = order.map(i => kmPerDay[i]);
    let days_str = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    let days_mobile = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    let days = days_str;
    if (window.innerWidth < 740) {
        days = days_mobile;
    }
    let data = kmPerDayOrdered.map(day => (day.elec + day.mech) / 1000);
    let colors = data.map(value => interpolateColor(value, Math.min(...data), Math.max(...data)));

    var options = {
        series: [{
            name: 'Distance parcourue',
            data: data
        }],
        chart: {
            type: 'bar',
            height: 400,
            stacked: true,
            events: {
            }
        },
        colors: colors,
        plotOptions: {
            bar: {
                // horizontal: false,
                distributed: true,
                columnWidth: '90%',
            },

        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: days,
            labels: {
                // rotate: -90,

                style: {
                    colors: '#FFFFFF' 
                }
            }
        },
        legend: {
            show: false
        },
        yaxis: {
            title: {
                text: 'Distance (km)',

                style: {
                    fontSize: '14px',
                    color: '#FFFFFF' 
                }
            },
            labels: {
                formatter: function (value) {
                    return value.toFixed(0) + ' km';
                },
                style: {
                    fontSize: '14px',
                    colors: '#FFFFFF' 
                }
            }

        },
        animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
            animateGradually: {
                enabled: true,
                delay: 150
            },
            dynamicAnimation: {
                enabled: true,
                speed: 1000
            }
        },
        tooltip: {
            theme: 'dark', 
            style: {
                fontSize: '12px',
                fontFamily: undefined,
            },
            fillSeriesColor: false,
            backdropColor: '#FFFFFF' 
        }
    };

    var chart = new ApexCharts(document.querySelector("#chart-days"), options);
    chart.render();

    // favorite day
    let maxDay = Math.max(...kmPerDayOrdered.map(day => day.elec + day.mech));
    let favoriteDay = days_str[kmPerDayOrdered.findIndex(day => day.elec + day.mech == maxDay)];
    document.getElementById('jour-favorite').innerText = favoriteDay;
    favorite_day = favoriteDay;
}

// PAGE 7

function showPage7(results) {
    let page = document.getElementById('page-7');
    page.innerHTML = `
            <div id="buttons-days">
            </div>
            <div id="map-days" class="map"></div>
    `;

    // Page 7 : maps for each day (same as page 5, but with day of the week)
    let days = [1, 2, 3, 4, 5, 6, 0];
    let days_str = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    let days_mobile_str = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    if (window.innerWidth < 740) {
        days_str = days_mobile_str;
    }
    let trajets_by_days = {}
    days.forEach(day => {
        trajets_by_days[day] = [];
    });

    results.courses.forEach(course => {
        let day = new Date(course.startDate).getDay();
        if (!trajets_by_days[day]) {
            return
        }
        trajets_by_days[day].push(course);
    });

    var map = L.map(`map-days`).setView([48.8566, 2.3522], defaultZoom); // Paris coordinates

    let dark_layer = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_dark/{z}/{x}/{y}{r}.{ext}', {
        minZoom: 11,
        maxZoom: 15,
        attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: 'png'
    })


    dark_layer.addTo(map);

    let button_div = document.getElementById('buttons-days');
    let first_button_div = document.createElement('div');
    first_button_div.className = 'six-months';

    let list_polylines = [];
    let current_color = 'yellow';

    for (let i = 0; i < 7; i++) {
        let button = document.createElement('button');
        button.className = 'button-day';
        button.innerText = days_str[i]
        button.addEventListener('mouseover', () => {
            list_polylines.forEach(polyline => {
                map.removeLayer(polyline);
            });
            trajets_by_days[days[i]].forEach(course => {
                let startStation = results.stationsList[course.departureStationId];
                let endStation = results.stationsList[course.arrivalStationId];
                if (!startStation || !endStation) {
                    return;
                }
                let polyline = L.polyline([
                    [startStation.lat, startStation.lon],
                    [endStation.lat, endStation.lon]
                ], {
                    color: current_color,
                    opacity: 0.7,
                    className: 'animated-dots',
                    zIndexOffset: 1
                }).addTo(map);
                list_polylines.push(polyline);

            });
            // remove active from other buttons
            document.querySelectorAll('.button-day').forEach(button => {
                button.classList.remove('active');
            });
            button.classList.add('active');
        });
        first_button_div.appendChild(button);
    }

    button_div.appendChild(first_button_div);

    let maxDay = Math.max(...results.kmPerDay.map(day => day.elec + day.mech));
    let favoriteDay = results.kmPerDay.findIndex(day => day.elec + day.mech == maxDay);
    favoriteDay = (favoriteDay + 6) % 7;

    document.querySelectorAll('.button-day')[favoriteDay].dispatchEvent(new Event('mouseover'));


    // refresh
    map.invalidateSize();
}

// PAGE 8

function showPage8(results) {
    const page = document.getElementById('page-8');

    // Conversion en km (si tes données sont en mètres)
    const kmDay = (results.kmDay / 1000).toFixed(0);
    const kmNight = (results.kmNight / 1000).toFixed(0);
    const total = parseFloat(kmDay) + parseFloat(kmNight);

    const dayPct = ((kmDay / total) * 100).toFixed(0);
    const nightPct = (100 - dayPct).toFixed(0);

    page.innerHTML = `
            <h2 style="text-align:center; margin-bottom: 50px;">Plutôt oiseau de jour ou de nuit ?</h2>
           <div class="page-8-container">
                <div class="label-side label-day">
                    <span class="value">${kmDay} kms</span><br>
                    <span class="sub">de jour (${dayPct}%)</span>
                </div>
                
                <div id="chart-day-night"></div>
                
                <div class="label-side label-night">
                    <span class="value">${kmNight} kms</span><br>
                    <span class="sub">de nuit (${nightPct}%)</span>
                </div>
            </div>
    `;

    let decalage = 0;
    if (parseFloat(nightPct) >= 50) {
        decalage = -90 * (parseFloat(nightPct) - 50) / 50;
    } else {
        decalage = 90 * (50 - parseFloat(nightPct)) / 50;
    }

    // smaller size on mobile
    let width_chart = '400px';
    if (window.innerWidth < 600) {
        width_chart = '150px';
    }
    const options = {
        series: [parseFloat(nightPct), parseFloat(dayPct),],
        chart: {
            type: 'pie',
            width: width_chart,
        },
        labels: ['Nuit', 'Jour'],
        colors: ['#1a1a2e', '#FFD700'],
        dataLabels: {
            enabled: false 
        },
        legend: {
            show: false
        },
        stroke: {
            show: false
        },
        plotOptions: {
            pie: {
                startAngle: decalage, 
                endAngle: decalage + 360,
                expandOnClick: false
            }
        },
        tooltip: {
            enabled: true,
            y: {
                formatter: (val) => val + "%"
            }
        }
    };

    const chart = new ApexCharts(document.querySelector("#chart-day-night"), options);
    chart.render();
}


// PAGE 9

let horaire_favorite;

function showPage9(results) {
    let page = document.getElementById('page-9');
    page.innerHTML = `
            <div id="chart-hours" class="chart">

            </div>
              <div class="chart-legend">Vous pédalez surtout <div id="tranche-3h" class="emph inline"></div>.
            </div>
    `;

    let kmPerHour = results.kmPerHour;
    let data = kmPerHour.map(hour => (hour.elec + hour.mech) / 1000);
    let colors = data.map(value => interpolateColor(value, Math.min(...data), Math.max(...data)));
    let label_hours = ['0h', '1h', '2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h', '22h', '23h'];

    var options = {
        series: [{
            name: 'Distance parcourue',
            data: data
        }],
        chart: {
            type: 'bar',
            height: 400,
            stacked: true,
            events: {
            }
        },
        colors: colors,
        plotOptions: {
            bar: {
                // horizontal: false,
                distributed: true,
                columnWidth: '90%',
            },

        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: label_hours,
            labels: {
                // rotate: -90,

                style: {
                    colors: '#FFFFFF'
                }
            }
        },
        legend: {
            show: false
        },
        yaxis: {
            title: {
                text: 'Distance (km)',

                style: {
                    fontSize: '14px',
                    color: '#FFFFFF'
                }
            },
            labels: {
                formatter: function (value) {
                    return value.toFixed(0) + ' km';
                },
                style: {
                    fontSize: '14px',
                    colors: '#FFFFFF' 
                }
            }

        },
        animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
            animateGradually: {
                enabled: true,
                delay: 150
            },
            dynamicAnimation: {
                enabled: true,
                speed: 1000
            }
        },
        tooltip: {
            theme: 'dark', 
            style: {
                fontSize: '12px',
                fontFamily: undefined,
            },
            fillSeriesColor: false, 
            backdropColor: '#FFFFFF' 
        }
    };

    var chart = new ApexCharts(document.querySelector("#chart-hours"), options);
    chart.render();

    let max3h = 0;
    let max3hIndex = 0;
    for (let i = 0; i < 24; i++) {
        let sum = 0;
        for (let j = 0; j < 3; j++) {
            sum += data[(i + j) % 24];
        }
        if (sum > max3h) {
            max3h = sum;
            max3hIndex = i;
        }
    }
    let max3hStr = `entre ${label_hours[max3hIndex]} et ${label_hours[(max3hIndex + 3) % 24]}`;
    horaire_favorite = max3hStr;
    document.getElementById('tranche-3h').innerText = max3hStr;

}

// PAGE 10

let simulationState = {
    currentTime: 0, // minutes de 0 à 1440
    isPlaying: true,
    speed: 1,
    lastFrameTime: 0,
    activeTrips: new Map(),
    fadingTrips: [],
    map: null
};

function clearMapLayers() {
    // Supprimer les trajets actifs
    simulationState.activeTrips.forEach(data => {
        if (data.marker) simulationState.map.removeLayer(data.marker);
        if (data.line) simulationState.map.removeLayer(data.line);
    });
    simulationState.activeTrips.clear();

    // Supprimer les trajets en fondu
    simulationState.fadingTrips.forEach(item => {
        simulationState.map.removeLayer(item.line);
    });
    simulationState.fadingTrips = [];
}


function showPage10(results) {
    const container = document.getElementById('page-10');
    container.innerHTML = `
            <h2>Une journée avec vous...</h2>
            <div id="map-container-10">
                <div id="map-10" class="map"></div>
                <div class="map-overlay-clock" id="clock-10">00h00</div>
            </div>
            
            <div class="controls-10">
                <div class="timeline-container" id="timeline-bg">
                    <div id="timeline-progress"></div>
                </div>
                
                <div class="playback-buttons">
                <button class="btn-control-icon" id="btn-play-pause">
                        <span class="material-icons" id="play-pause-icon">pause</span>
                    </button>
                    <button class="btn-control speed-btn" data-speed="0.5">x0.5</button>
                    <button class="btn-control speed-btn active" data-speed="1">x1</button>
                    <button class="btn-control speed-btn" data-speed="2">x2</button>
                    <button class="btn-control speed-btn" data-speed="4">x4</button>
                </div>
        </div>
    `;

    simulationState.map = L.map('map-10').setView([48.8566, 2.3522], defaultZoom); 


    L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_dark/{z}/{x}/{y}{r}.{ext}', {
        minZoom: 11,
        maxZoom: 15,
        attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: 'png'
    }).addTo(simulationState.map);

    document.getElementById('btn-play-pause').onclick = () => {
        simulationState.isPlaying = !simulationState.isPlaying;
        document.getElementById('play-pause-icon').innerText = simulationState.isPlaying ? "pause" : "play_arrow";
    };

    document.querySelectorAll('.speed-btn').forEach(btn => {
        btn.onclick = (e) => {
            document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
            simulationState.speed = parseFloat(e.target.dataset.speed);
            e.target.classList.add('active');
        };
    });

    // Reset de l'état
    simulationState.currentTime = 0;
    simulationState.activeTrips.clear();
    simulationState.fadingTrips = [];
    simulationState.lastFrameTime = 0;

    const courses = results.coursesByHour;

    const BASE_SPEED_RATIO = 0.024;

    const timeline = document.getElementById('timeline-bg');
    timeline.onclick = (e) => {
        const rect = timeline.getBoundingClientRect();
        const x = e.clientX - rect.left; // Position du clic
        const width = rect.width;
        const percentage = x / width;

        simulationState.currentTime = percentage * 1440;

        clearMapLayers();
        updateSimulationFrame(courses);
    };

    function animate(timestamp) {
        if (!simulationState.lastFrameTime) simulationState.lastFrameTime = timestamp;
        const delta = timestamp - simulationState.lastFrameTime;
        simulationState.lastFrameTime = timestamp;

        if (simulationState.isPlaying) {
            const simDelta = delta * BASE_SPEED_RATIO * simulationState.speed;
            simulationState.currentTime = (simulationState.currentTime + simDelta) % 1440;

            updateSimulationFrame(courses);
        }

        if (document.getElementById('map-10')) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

function updateSimulationFrame(courses) {
    const now = simulationState.currentTime;

    const h = Math.floor(now / 60).toString().padStart(2, '0');
    const m = Math.floor(now % 60).toString().padStart(2, '0');
    document.getElementById('clock-10').innerText = `${h}h${m}`;
    document.getElementById('timeline-progress').style.width = `${(now / 1440) * 100}%`;

    courses.forEach((course, index) => {
        let duration = course.endTime - course.startTime;
        if (duration < 0) duration += 1440;
        let elapsed = now - course.startTime;
        if (elapsed < 0 && now < course.endTime && course.endTime < course.startTime) elapsed += 1440;

        const isActive = elapsed >= 0 && elapsed <= duration;
        const tripKey = `trip-${index}`;

        if (isActive) {
            const progress = elapsed / duration;
            const curLat = course.startLat + (course.endLat - course.startLat) * progress;
            const curLon = course.startLon + (course.endLon - course.startLon) * progress;

            if (!simulationState.activeTrips.has(tripKey)) {
                const marker = L.circleMarker([curLat, curLon], {
                    radius: 5, fillColor: 'yellow', color: 'none', fillOpacity: 1, zIndexOffset: 1000
                }).addTo(simulationState.map);

                const line = L.polyline([[course.startLat, course.startLon], [curLat, curLon]], {
                    color: 'yellow', weight: 3, opacity: 0.7
                }).addTo(simulationState.map);

                simulationState.activeTrips.set(tripKey, { marker, line });
            } else {
                const active = simulationState.activeTrips.get(tripKey);
                active.marker.setLatLng([curLat, curLon]);
                active.line.setLatLngs([[course.startLat, course.startLon], [curLat, curLon]]);
            }
        } else if (simulationState.activeTrips.has(tripKey)) {
            const active = simulationState.activeTrips.get(tripKey);
            simulationState.map.removeLayer(active.marker); // Le cercle disparaît direct

            // On passe la ligne dans la liste des fondus
            simulationState.fadingTrips.push({
                line: active.line,
                opacity: 0.7
            });
            simulationState.activeTrips.delete(tripKey);
        }
    });

    simulationState.fadingTrips = simulationState.fadingTrips.filter(item => {
        item.opacity -= 0.015; 
        if (item.opacity <= 0) {
            simulationState.map.removeLayer(item.line);
            return false;
        }
        item.line.setStyle({ opacity: item.opacity });
        return true;
    });
}

// PAGE 11


function showPage11(results) {
    const container = document.getElementById('page-11');
    container.innerHTML = `
            <h2>Où êtes vous allé ?</h2>
            <div class="page-11-container">
                
                <div class="left-side">
                    <div id="map-holder" style="position:relative;">
                        <div id="paris-map-container"></div>
                        <div id="tooltip-map" class="map-tooltip"></div>
                    </div>
                    
                    <div class="top-locations">
                        <div id="top-5-list"></div>
                    </div>
                </div>

                <div class="right-side">
                    <div class="rive-chart-labels"> <div id="rive-droite-value" class="rive-label emph"></div> Rive Droite </div>
                    <div id="chart-rive"></div>
                    <div class="rive-chart-labels"> <div id="rive-gauche-value" class="rive-label emph"></div> Rive Gauche </div>
                </div>

        </div>
    `;

    renderParisMap(results.locationCounts);
    renderTopExtraParis(results.locationCounts);
    renderRiveChart(results.riveCounts);
}
function renderParisMap(locationCounts) {
    const width = 500;
    const height = 400;

    d3.select("#paris-map-container").html("");

    const svg = d3.select("#paris-map-container")
        .append("svg")
        .attr("id", "paris-map-svg")
        .attr("viewBox", `0 0 ${width} ${height}`);

    const counts = Object.values(locationCounts);
    const maxVisits = d3.max(counts) || 1;

    let upperBound = Math.min(50, maxVisits);
    const colorScale = d3.scaleLinear()
        .domain([1, upperBound / 2, upperBound])
        .range(["#FF4500", "#FF8C00", "#FFD700",]);

    d3.json("arrondissements.geojson").then(data => {
        const projection = d3.geoMercator().fitSize([width, height], data);
        const path = d3.geoPath().projection(projection);
        const tooltip = d3.select("#tooltip-map");

        svg.selectAll("path")
            .data(data.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("class", "arrondissement")
            .attr("fill", d => {
                const numArr = d.properties.c_ar; 
                const visits = locationCounts[`Paris ${numArr}e`];

                return visits === 0 ? "#333" : colorScale(visits);
            })
            .on("mouseover", function (event, d) {
                const numArr = d.properties.c_ar;
                const visits = locationCounts[`Paris ${numArr}e`];

                tooltip.style("opacity", 1)
                    .html(`<strong>${d.properties.c_ar}e arrondissement</strong><br>${visits} passage(s)`);

                d3.select(this).style("fill-opacity", 0.7);
            })
            .on("mousemove", function (event) {
                tooltip.style("left", (event.pageX + 15) + "px")
                    .style("top", (event.pageY - 15) + "px");
            })
            .on("mouseout", function () {
                tooltip.style("opacity", 0);
                d3.select(this).style("fill-opacity", 1);
            });
    });
}
function renderTopExtraParis(locationCounts) {
    const listContainer = document.getElementById('top-5-list');

    const extraParis = Object.entries(locationCounts)
        .filter(([loc]) => !loc.includes("Paris") && !loc.startsWith("75"))
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const filteredExtraParis = extraParis.filter(([name, visits]) => visits > 0);

    const maxVisits = filteredExtraParis[0] ? filteredExtraParis[0][1] : 1;
    let upperBound = Math.min(50, maxVisits);


    const colorScale = d3.scaleLinear()
        .domain([1, upperBound / 2, upperBound])
        .range(["#FF4500", "#FF8C00", "#FFD700",]);

    filteredExtraParis.forEach(([name, visits]) => {
        const size = 10 + (visits / maxVisits) * 20; 
        const color = colorScale(visits);

        listContainer.innerHTML += `
            <div class="location-item">
            <div class="location-dot-container">
                <div class="location-dot" style="width:${size}px; height:${size}px; background:${color}"></div>
            </div>
                <span><strong>${name}</strong> : ${visits} passage(s)</span>
            </div>
        `;
    });
}

function renderRiveChart(riveCounts) {
    const total = riveCounts["Gauche"] + riveCounts["Droite"];
    const gauchePct = ((riveCounts["Gauche"] / total) * 100).toFixed(1);
    const droitePct = (100 - gauchePct).toFixed(1);

    let decalage;
    if (parseFloat(droitePct) >= 50) {
        decalage = 90 * (100 - parseFloat(droitePct)) / 50;
    } else {
        decalage = -90 * (parseFloat(droitePct)) / 50;
    }


    const options = {
        series: [parseFloat(droitePct), parseFloat(gauchePct)],
        chart: { type: 'donut', width: '100%' },
        labels: ['Rive Droite', 'Rive Gauche'],
        colors: ['#f0e522', '#cf2e06'],
        legend: { position: 'bottom', show: false },
        tooltip: {
            enabled: false
        },
        dataLabels: {
            enabled: false
        },
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        show: false,
                        total: { show: false, label: 'Répartition' }
                    }
                }
            },
            pie: {
                startAngle: decalage,
                endAngle: decalage + 360,
                expandOnClick: false
            }
        }
    };

    const chart = new ApexCharts(document.querySelector("#chart-rive"), options);
    chart.render();
    document.getElementById('rive-gauche-value').innerText = gauchePct + "%";
    document.getElementById('rive-droite-value').innerText = droitePct + "%";
}

// PAGE 12

function showPage12(results) {
    const stationsList = results.stationsList;

    const container = document.getElementById('page-12');
    container.innerHTML = `
            <div class="page-12-container">
                <div class="left-column">
                    <div>
                        <h3 style="font-family:'Montserrat-b'"><span class="material-icons" style="vertical-align:bottom">place</span> Top 5 Stations</h3>
                        <div id="top-stations-list"></div>
                    </div>
                    <div>
                        <h3 style="font-family:'Montserrat-b'"><span class="material-icons" style="vertical-align:bottom">multiple_stop</span> Top 5 Trajets</h3>
                        <div id="top-trips-list"></div>
                    </div>
                </div>
                <div class="right-column">
                    <div id="map-12"></div>
                </div>
            </div>
    `;

    const map = L.map('map-12').setView([48.8566, 2.3522], defaultZoom);
    L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_dark/{z}/{x}/{y}{r}.{ext}', {
        minZoom: 11,
        maxZoom: 15,
        attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: 'png'
    }).addTo(map);

    let bounds = L.latLngBounds([]);

    const mapLayers = {
        stations: new Map(),
        trips: new Map()
    };

    results.topStations.forEach((s) => {
        const fullStation = stationsList[s.stationId];
        if (!fullStation) return;

        const loc = fullStation.location || "";

        const div = document.createElement('div');
        div.className = 'fav-item';
        div.innerHTML = `
            <div class="visit-badge">${s.count}×</div>
            <div>
                <div class="station-name">${s.name}
                <div class="station-loc">(${loc})</div></div>
            </div>
        `;
        document.getElementById('top-stations-list').appendChild(div);

        const marker = L.circleMarker([fullStation.lat, fullStation.lon], {
            radius: 8, fillColor: 'yellow', color: '#fff', weight: 2, fillOpacity: 0.8
        }).addTo(map);

        mapLayers.stations.set(s.stationId, marker);
        bounds.extend([fullStation.lat, fullStation.lon]);

        div.onmouseover = () => {
            marker.setStyle({ radius: 15, weight: 4, fillColor: '#FF4500' });
            marker.bringToFront();
        };
        div.onmouseout = () => {
            marker.setStyle({ radius: 8, weight: 2, fillColor: 'yellow' });
        };
    });


    results.topTrips.forEach((t) => {
        const [startId, endId] = t.trip.split('->');
        const startSt = stationsList[startId];
        const endSt = stationsList[endId];


        if (!startSt || !endSt) return;

        const div = document.createElement('div');
        div.className = 'fav-item';
        div.innerHTML = `
            <div class="visit-badge">${t.count}×</div>
            <div style="font-size:16px;">
                <strong>${startSt.name.split(' - ')[0]}</strong> 
                <span class="material-icons" style="font-size:14px; vertical-align:middle">arrow_forward</span> 
                <strong>${endSt.name.split(' - ')[0]}</strong>
            </div>
        `;
        document.getElementById('top-trips-list').appendChild(div);

        const polyline = L.polyline([[startSt.lat, startSt.lon], [endSt.lat, endSt.lon]], {
            color: 'yellow',
            opacity: 0.7,
            weight: 4,
            className: 'animated-dots'
        }).addTo(map);

        mapLayers.trips.set(t.trip, polyline);
        bounds.extend([[startSt.lat, startSt.lon], [endSt.lat, endSt.lon]]);

        div.onmouseover = () => {
            polyline.setStyle({ color: '#FF4500', weight: 4, opacity: 1 });
            polyline.bringToFront();
        };
        div.onmouseout = () => {
            polyline.setStyle({ color: 'yellow', weight: 4, opacity: 1 });
        };
    });


    // refresh map
    map.invalidateSize();
}

// PAGE 13


function showPage13(results) {
    const stationsList = results.stationsList;
    const zones = results.zones;
    const allCourses = results.courses; 

    const container = document.getElementById('page-13');
    container.innerHTML = `<h3>Vos stations de 2025</h3>
    <div id="page-13-info" class="page-13-info">
        <span>Zoomez pour voir toutes les stations, et passez la souris sur un station pour voir les trajets associés.</span>
    </div>
    <div id="map-13" class="map"></div>`;

    const map = L.map('map-13').setView([48.8566, 2.3522], defaultZoom);
    L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_dark/{z}/{x}/{y}{r}.{ext}', {
        minZoom: 11,
        maxZoom: 15,
        attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: 'png'
    }).addTo(map);

    const zoneGroup = L.layerGroup().addTo(map);
    const stationGroup = L.layerGroup();
    const flowGroup = L.layerGroup().addTo(map); 

    let lockedStationId = null; 

    const MAX_REF_VISITS = 50;
    const realMaxVisits = Math.max(...zones.map(z => z.visits));
    const sizeReference = Math.max(realMaxVisits, MAX_REF_VISITS);

    function getColor(visits, maxVal) {
        const ratio = Math.min(visits / maxVal, 1);
        return d3.interpolateRgb("#FFD700", "#FF4500")(ratio);
    }

    function drawFlows(stationId) {
        flowGroup.clearLayers();
        const centerSt = stationsList[stationId];
        if (!centerSt) return;

       
        const targetsOut = new Set(); 
        const targetsIn = new Set();  

        allCourses.forEach(c => {
            if (c.departureStationId == stationId && c.arrivalStationId && c.arrivalStationId != stationId) {
                targetsOut.add(c.arrivalStationId);
            }
            if (c.arrivalStationId == stationId && c.departureStationId && c.departureStationId != stationId) {
                targetsIn.add(c.departureStationId);
            }
        });

        targetsOut.forEach(targetId => {
            const targetSt = stationsList[targetId];
            if (!targetSt) return;
            L.polyline([[targetSt.lat, targetSt.lon], [centerSt.lat, centerSt.lon],], {
                color: '#FF4500', 
                weight: 3,
                opacity: 0.8,
                className: 'flow-out'
            }).addTo(flowGroup);
        });

        targetsIn.forEach(targetId => {
            const targetSt = stationsList[targetId];
            if (!targetSt) return;
            L.polyline([[targetSt.lat, targetSt.lon], [centerSt.lat, centerSt.lon]], {
                color: '#FFD700', 
                weight: 3,
                opacity: 0.8,
                className: 'flow-in'
            }).addTo(flowGroup);
        });
    }

    function updateView() {
        const zoom = map.getZoom();
        flowGroup.clearLayers();
        lockedStationId = null;

        if (zoom < 13) {
            if (!map.hasLayer(zoneGroup)) { map.removeLayer(stationGroup); map.addLayer(zoneGroup); }
            zoneGroup.clearLayers();
            zones.forEach(zone => {
                const mainSt = stationsList[zone.mainStationId];
                if (!mainSt) return;
                const radius = 8 + (Math.min(zone.visits, sizeReference) / sizeReference) * 35;
                const color = getColor(zone.visits, realMaxVisits);
                const circle = L.circleMarker([mainSt.lat, mainSt.lon], {
                    radius: radius, fillColor: color, color: '#fff', weight: 1.5, fillOpacity: 0.8
                }).addTo(zoneGroup);

                if (zone.stations.length > 1) {
                    L.marker([mainSt.lat, mainSt.lon], {
                        icon: L.divIcon({
                            className: 'zone-count-label',
                            html: `<div style="line-height: ${radius * 2}px;">${zone.stations.length}</div>`,
                            iconSize: [radius * 2, radius * 2],
                            iconAnchor: [radius, radius]
                        }),
                        interactive: false
                    }).addTo(zoneGroup);

                    circle.bindTooltip(`<strong>${mainSt.name} et ${zone.stations.length - 1} autres</strong><br>${zone.visits} visite(s) sur ${zone.stations.length} station(s)`);
                } else {
                    circle.bindTooltip(`<strong>${mainSt.name}</strong><br>${zone.visits} visite(s)`);
                }
            });
        } else {
            if (!map.hasLayer(stationGroup)) { map.removeLayer(zoneGroup); map.addLayer(stationGroup); }
            stationGroup.clearLayers();
            const allStationIds = zones.flatMap(z => z.stations);
            const maxVisitsStation = Math.max(...allStationIds.map(id => stationsList[id].count));

            allStationIds.forEach(id => {
                const st = stationsList[id];
                if (!st || st.count === 0) return;
                const radius = 5 + (Math.min(st.count, 20) / 20) * 15;
                const color = getColor(st.count, maxVisitsStation);

                const circle = L.circleMarker([st.lat, st.lon], {
                    radius: radius, fillColor: color, color: '#fff', weight: 1, fillOpacity: 0.9
                }).addTo(stationGroup);

                // EVENEMENTS DE FLUX
                circle.on('mouseover', () => {
                    if (!lockedStationId) drawFlows(id);
                });
                circle.on('mouseout', () => {
                    if (!lockedStationId) flowGroup.clearLayers();
                });
                circle.on('click', (e) => {
                    L.DomEvent.stopPropagation(e); // Empêche le clic sur la carte
                    if (lockedStationId === id) {
                        lockedStationId = null;
                        flowGroup.clearLayers();
                    } else {
                        lockedStationId = id;
                        drawFlows(id);
                    }
                });

                circle.bindTooltip(`<strong>${st.name}</strong><br>${st.count} visite(s)`);
            });
        }
    }

    // Clic sur la carte pour déverrouiller
    map.on('click', () => {
        lockedStationId = null;
        flowGroup.clearLayers();
    });

    map.on('zoomend', updateView);
    updateView();
    const bounds = L.latLngBounds(zones.map(z => [stationsList[z.mainStationId].lat, stationsList[z.mainStationId].lon]));
    map.fitBounds(bounds, { padding: [50, 50] });
}


// PAGE 14

function showPage14(results) {
    const container = document.getElementById('page-14');

    const achList = [
        { id: 1, key: 'km1000', name: "1000km", img: "trophy.png" },
        { id: 2, key: 'tourParis', name: "Le tour de Paris", img: "day.png" },
        { id: 3, key: 'enBoucle', name: "En boucle", img: "refresh.png" },
        { id: 4, key: 'addict', name: "Addict", img: "flamme.png" },
        { id: 5, key: 'surSeine', name: "Sur la Seine", img: "bridge.png" },
        { id: 6, key: 'cendrillon', name: "Cendrillon", img: "citrouille.png" },
        { id: 7, key: 'oiseauNuit', name: "Oiseau de nuit", img: "hibou.png" },
        { id: 8, key: 'romantique', name: "Romantique", img: "sunset.png" },
        { id: 9, key: 'teteEnLair', name: "Tête-en-l'air", img: "broken-heart.png" },
        { id: 10, key: 'collectionneur', name: "Collectionneur", img: "cartes.png" }
    ];

    let html = `
            <h3>Vos succès 2025</h3>
            <div class="achievements-grid">
    `;

    achList.forEach(ach => {
        const data = results.achievements[ach.key];
        const isUnlocked = data && data.unlocked;

        html += `
            <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-number">${ach.id}</div>
                <div class="achievement-circle" style="background: ${isUnlocked ? data.color : "#333"};">
                    <img src="img/${isUnlocked ? ach.img : 'unknown.png'}" alt="icon">
                </div>
                <div class="achievement-name">${isUnlocked ? ach.name : '???'}</div>
                <div class="achievement-desc">${isUnlocked ? data.description : data.fail}</div>
            </div>
        `;
    });

    html += `</div>`;
    container.innerHTML = html;
}

// PAGE 15

function renderParisMapEnd(locationCounts) {
    const width = 500;
    const height = 200;

    d3.select("#paris-map-container-end").html("");

    const svg = d3.select("#paris-map-container-end")
        .append("svg")
        .attr("id", "paris-map-svg")
        .attr("viewBox", `0 0 ${width} ${height}`);

    const counts = Object.values(locationCounts);
    const maxVisits = d3.max(counts) || 1;

    let upperBound = Math.min(50, maxVisits);
    const colorScale = d3.scaleLinear()
        .domain([1, upperBound / 2, upperBound])
        .range(["#FF4500", "#FF8C00", "#FFD700",]);

    d3.json("arrondissements.geojson").then(data => {
        const projection = d3.geoMercator().fitSize([width, height], data);
        const path = d3.geoPath().projection(projection);

        svg.selectAll("path")
            .data(data.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("class", "arrondissement")
            .attr("fill", d => {
                const numArr = d.properties.c_ar; 
                const visits = locationCounts[`Paris ${numArr}e`];

                return visits === 0 ? "#333" : colorScale(visits);
            })
    });
}
function showPage15(results) {


    const kmDay = (results.kmDay / 1000).toFixed(0);
    const kmNight = (results.kmNight / 1000).toFixed(0);
    const total = parseFloat(kmDay) + parseFloat(kmNight);

    const dayPct = ((kmDay / total) * 100).toFixed(0);
    const nightPct = (100 - dayPct).toFixed(0);


    let oiseauStr;
    if (dayPct >= nightPct) {
        oiseauStr = `Oiseau de jour (${dayPct}%)`;
    } else {
        oiseauStr = `Oiseau de nuit (${nightPct}%)`;
    }


    let riveCounts = results.riveCounts;

    const totalRive = riveCounts["Gauche"] + riveCounts["Droite"];
    const gauchePct = ((riveCounts["Gauche"] / totalRive) * 100).toFixed(1);
    const droitePct = (100 - gauchePct).toFixed(1);

    let riveStr;
    if (droitePct >= gauchePct) {
        riveStr = `Rive Droite (${droitePct}%)`;
    } else {
        riveStr = `Rive Gauche (${gauchePct}%)`;
    }

    let stationFavorite = results.topStations[0];
    let topStation = stationFavorite ? stationFavorite.name : "Aucune";

    let stationsList = results.stationsList;
    let tripFavorite = results.topTrips[0];
    const [startId, endId] = tripFavorite.trip.split('->');
    const startSt = stationsList[startId];
    const endSt = stationsList[endId];
    let topTrip = tripFavorite && startSt && endSt ?
        `${startSt.name.split(' - ')[0]} → ${endSt.name.split(' - ')[0]}` :
        "Aucun";

    let html = `
            <h1 class="final-title">Votre Véliwrap 2025 est fini !</h1>
            
            <div class="final-wrap-container">
                <div class="final-left">
                    <div class="stat-item"><span>Distance parcourue</span> <span class="stat-value">${results.totalDistance.toFixed(0)} km</span></div>
                    <div class="stat-item"><span>Temps passé à Vélib</span> <span class="stat-value">${Math.floor(results.totalMinutes / 60)}h ${Math.round(results.totalMinutes % 60)}min</span></div>
                    <div class="stat-item"><span>Nombre de trajets</span> <span class="stat-value">${results.nbTrips}</span></div>
                    <div class="stat-item"><span>Distance maximale en une journée</span> <span class="stat-value">${results.maxDistanceInADay.toFixed(1)} km</span></div>
                    <div class="stat-item"><span>Nombre de jours consécutifs</span> <span class="stat-value">${results.maxStreak} jours</span></div>
                    <div class="stat-item"><span>Utilisation électrique</span> <span class="stat-value">${Math.round((results.totalDistanceElec / results.totalDistance) * 100)}%</span></div>
                    <div class="stat-item"><span>Vitesse moy. (Mécanique)</span> <span class="stat-value">${results.avgSpeedMech.toFixed(1)} km/h</span></div>
                    <div class="stat-item"><span>Vitesse moy. (Électrique)</span> <span class="stat-value">${results.avgSpeedElec.toFixed(1)} km/h</span></div>
                    <div class="stat-item"><span>Saison préférée</span> <span class="stat-value">${favorite_season || 'N/A'}</span></div>
                    <div class="stat-item"><span>Jour préféré</span> <span class="stat-value">${favorite_day || 'N/A'}</span></div>
                    <div class="stat-item"><span>Horaires favoris</span> <span class="stat-value">${horaire_favorite}</span></div>
                    <div class="stat-item"><span>Jour/Nuit</span> <span class="stat-value">${oiseauStr}</span></div>
                </div>

                <div class="final-right">
                    <div id="map-holder" style="position:relative;">
                        <div id="paris-map-container-end"></div>
                        <div id="tooltip-map" class="map-tooltip"></div>
                    </div>
                    
                    <div class="final-favorites">
                        <div class="stat-item"><span>Rive</span> <span class="stat-value">Team ${riveStr}</span></div>
                        <div class="stat-item"><span>Station favorite</span> <span class="stat-value">${topStation}</span></div>
                        <div class="stat-item" style="border:none"><span>Trajet favori</span> <span class="stat-value">${topTrip}</span></div>
                    </div>

                    <div class="mini-achievements-title">Succès débloqués</div>
                    <div class="mini-achievements-list">
                        ${generateMiniBadges(results)}
                    </div>
                </div>
            </div>
            <div class="final-thanks">Merci d'avoir testé Veliwrap, n'hésitez pas à partager ! :)</div>
    `;


    document.getElementById('page-15').innerHTML = html;
    renderParisMapEnd(results.locationCounts);
}

// Fonction helper pour les badges
function generateMiniBadges(results) {

    const achList = [
        { id: 1, key: 'km1000', name: "1000km", img: "trophy.png" },
        { id: 2, key: 'tourParis', name: "Le tour de Paris", img: "day.png" },
        { id: 3, key: 'enBoucle', name: "En boucle", img: "refresh.png" },
        { id: 4, key: 'addict', name: "Addict", img: "flamme.png" },
        { id: 5, key: 'surSeine', name: "Sur la Seine", img: "bridge.png" },
        { id: 6, key: 'cendrillon', name: "Cendrillon", img: "citrouille.png" },
        { id: 7, key: 'oiseauNuit', name: "Oiseau de nuit", img: "hibou.png" },
        { id: 8, key: 'romantique', name: "Romantique", img: "sunset.png" },
        { id: 9, key: 'teteEnLair', name: "Tête-en-l'air", img: "broken-heart.png" },
        { id: 10, key: 'collectionneur', name: "Collectionneur", img: "cartes.png" }
    ];

    return Object.keys(results.achievements)
        .filter(key => results.achievements[key].unlocked)
        .map(key => {
            const ach = results.achievements[key];
            return `
                <div class="achievement-mini-circle" 
                     style="background:${ach.color}" 
                     data-tooltip="${achList.find(item => item.key === key).name} : ${ach.description}">
                    <img src="img/${achList.find(item => item.key === key).img}" alt="icon">
                </div>
            `;
        }).join('');
}