
function distancePos(pointA, pointB) {
    // return distance in meters from latitude and longitude
    let lat1 = pointA.lat;
    let lon1 = pointA.lon;
    let lat2 = pointB.lat;
    let lon2 = pointB.lon;
    let R = 6371e3; // metres
    let φ1 = lat1 * Math.PI / 180; // φ, λ in radians
    let φ2 = lat2 * Math.PI / 180;
    let Δφ = (lat2 - lat1) * Math.PI / 180;
    let Δλ = (lon2 - lon1) * Math.PI / 180;

    let a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    let d = R * c; // in metres
    return d;
}




async function getData(allCourses, stations) {


    let out_file = {};


    // get the first day of the current month
    let today = new Date();
    let firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    // set minus 1 second to be in the previous month
    firstDay.setSeconds(firstDay.getSeconds() - 1);
    // now take 1 year before for the start date
    let oneYearBefore = new Date(firstDay);
    oneYearBefore.setFullYear(oneYearBefore.getFullYear() - 1);

    // filter the courses in the last year
    let coursesInLastYear = allCourses.filter(course => {
        let startDate = new Date(course.startDate);
        let endDate = new Date(course.endDate);
        return startDate > oneYearBefore && endDate < firstDay;
    });

    let stationsList = {}
    stations.forEach(station => {
        stationsList[station.station_id] = {
            name: station.name,
            lat: station.lat,
            lon: station.lon,
            location: station.location,
            rive: station.rive
        };
    });

    // now get the interesting info about the courses
    let coursesList = [];
    coursesInLastYear.forEach(course => {
        // if distance is < 500m, we don't take it into account
        if (parseFloat(course.parameter3.DISTANCE) < 500) {
            return;
        }
        let courseData = {
            startDate: course.startDate,
            endDate: course.endDate,
            bikeId: course.parameter3.BIKEID,
            distance: parseFloat(course.parameter3.DISTANCE),
            speed: parseFloat(course.parameter3.DISTANCE) / ((new Date(course.endDate) - new Date(course.startDate)) / 60 / 60),
            arrivalStationId: course.parameter3.arrivalStationId,
            departureStationId: course.parameter3.departureStationId,
            isElectricBike: (course.parameter1 === 'yes')
        };

        if (!courseData.startDate || !courseData.endDate) {
            return;
        }
        coursesList.push(courseData);
    });

    // now we have the courses, let's compute the total distance
    let totalDistance = coursesList.reduce((acc, course) => acc + course.distance, 0);
    totalDistance = totalDistance / 1000;
    out_file.totalDistance = totalDistance;

    let totalTime = coursesList.reduce((acc, course) => acc + (new Date(course.endDate) - new Date(course.startDate)), 0);
    let totalMinutes = totalTime / 1000 / 60;
    out_file.totalMinutes = totalMinutes;
    out_file.totalTime = totalTime;

    let nbTrips = coursesList.length;
    out_file.nbTrips = nbTrips;

    let totalDistanceElec = coursesList.filter(course => course.isElectricBike).reduce((acc, course) => acc + course.distance, 0);
    totalDistanceElec = totalDistanceElec / 1000;
    out_file.totalDistanceElec = totalDistanceElec;

    let totalDistanceMech = totalDistance - totalDistanceElec;
    out_file.totalDistanceMech = totalDistanceMech;

    // number of distinct days with trips
    let daysWithTrips = new Set();
    coursesList.forEach(course => {
        let dayStr = new Date(course.startDate).toISOString().split('T')[0];
        daysWithTrips.add(dayStr);
    });
    out_file.nbDaysWithTrips = daysWithTrips.size;

    // Maximum streak of consecutive days with trips
    let daysArray = Array.from(daysWithTrips).sort();
    let maxStreak = 0;
    let currentStreak = 1;
    for (let i = 1; i < daysArray.length; i++) {
        let prevDay = new Date(daysArray[i - 1]);
        let currentDay = new Date(daysArray[i]);
        // if same day, continue
        if (prevDay.getTime() === currentDay.getTime()) {
            continue;
        }
        let diffTime = currentDay - prevDay;
        let diffDays = diffTime / (1000 * 60 * 60 * 24);
        if (diffDays === 1) {
            currentStreak++;
        }
        else {
            if (currentStreak > maxStreak) {
                maxStreak = currentStreak;
            }
            currentStreak = 1;
        }
    }
    if (currentStreak > maxStreak) {
        maxStreak = currentStreak;
    }
    out_file.maxStreak = maxStreak;

    // Maximal distance in a day
    let distancePerDay = {};
    coursesList.forEach(course => {
        let dayStr = new Date(course.startDate).toISOString().split('T')[0];
        if (!distancePerDay[dayStr]) {
            distancePerDay[dayStr] = 0;
        }
        distancePerDay[dayStr] += course.distance;
    });
    let maxDistanceInADay = 0;
    let maxDistanceInADayDate = null;
    Object.values(distancePerDay).forEach(dist => {
        if (dist > maxDistanceInADay) {
            maxDistanceInADay = dist;
            maxDistanceInADayDate = Object.keys(distancePerDay).find(key => distancePerDay[key] === dist);
        }
    });
    out_file.maxDistanceInADay = maxDistanceInADay / 1000;

    // Average speed with electric bikes and mechanical bikes
    let totalSpeedElec = 0;
    let countElec = 0;
    let totalSpeedMech = 0;
    let countMech = 0;
    coursesList.forEach(course => {
        if (course.isElectricBike) {
            totalSpeedElec += course.speed;
            countElec++;
        } else {
            totalSpeedMech += course.speed;
            countMech++;
        }
    });
    out_file.avgSpeedElec = (countElec > 0) ? (totalSpeedElec / countElec) : 0;
    out_file.avgSpeedMech = (countMech > 0) ? (totalSpeedMech / countMech) : 0;

    // How many time midnight during the trip + how many trips started after 2 and before 6am
    let countMidnight = 0;
    let countEarlyMorning = 0;
    coursesList.forEach(course => {
        let startDate = new Date(course.startDate);
        let endDate = new Date(course.endDate);
        if (startDate.getDate() !== endDate.getDate()) {
            countMidnight++;
        }
        let startHour = startDate.getHours();
        let endHour = endDate.getHours();
        if (startHour >= 2 && endHour < 6) {
            countEarlyMorning++;
        }
    });

    out_file.countMidnight = countMidnight;
    out_file.countEarlyMorning = countEarlyMorning;


    // find the 5 trip (start -> end) that has been done the most times (and how many times)
    let tripCounts = {};
    coursesList.forEach(course => {
        let tripKey = course.departureStationId + "->" + course.arrivalStationId;
        if (!tripCounts[tripKey]) {
            tripCounts[tripKey] = 0;
        }
        tripCounts[tripKey]++;
    });
    let maxTripCount = 0;
    let maxTripKey = null;
    Object.keys(tripCounts).forEach(tripKey => {
        if (tripCounts[tripKey] > maxTripCount) {
            maxTripCount = tripCounts[tripKey];
            maxTripKey = tripKey;
        }
    });
    // top 5
    let topTrips = Object.keys(tripCounts).sort((a, b) => tripCounts[b] - tripCounts[a]).slice(0, 5).map(tripKey => {
        return { trip: tripKey, count: tripCounts[tripKey] };
    });
    out_file.topTrips = topTrips;

    // count the number of time each station is visited (must be in "stationsList")
    let nbStationsVisited = 0;
    coursesList.forEach(course => {
        if (stationsList[course.departureStationId]) {
            if (!stationsList[course.departureStationId].count) {
                stationsList[course.departureStationId].count = 1;
                nbStationsVisited++;
            } else {
                stationsList[course.departureStationId].count++;
            }
        }
        if (stationsList[course.arrivalStationId]) {
            if (!stationsList[course.arrivalStationId].count) {
                stationsList[course.arrivalStationId].count = 1;
                nbStationsVisited++;
            } else {
                stationsList[course.arrivalStationId].count++;
            }
        }
    });
    out_file.nbStationsTotal = stations.length;


    // init at zero based on stations
    let locationCounts = {};
    Object.values(stationsList).forEach(station => {
        let location = station.location;
        if (location) {
            if (!locationCounts[location]) {
                locationCounts[location] = 0;
            }
        }
    });


    // remove the stations that have not been visited
    Object.keys(stationsList).forEach(stationId => {
        if (!stationsList[stationId].count) {
            delete stationsList[stationId];
        }
    });
    out_file.nbStationsVisited = nbStationsVisited;
    out_file.stationsList = stationsList;

    // Top 5 stations most visited
    let topStations = Object.keys(stationsList).sort((a, b) => stationsList[b].count - stationsList[a].count).slice(0, 5).map(stationId => {
        return { stationId: stationId, name: stationsList[stationId].name, count: stationsList[stationId].count };
    });
    out_file.topStations = topStations;


    // Number of time crossing the Seine
    let countSeineCrossings = 0;
    coursesList.forEach(course => {
        if (!stationsList[course.departureStationId] || !stationsList[course.arrivalStationId]) {
            return;
        }
        let departRive = stationsList[course.departureStationId].rive;
        let arriveRive = stationsList[course.arrivalStationId].rive;
        if (departRive == "Les deux" || arriveRive == "Les deux") {
            return;
        }
        if (departRive !== arriveRive) {
            countSeineCrossings++;
        }
    });
    out_file.countSeineCrossings = countSeineCrossings;

    // count the number of time each "location" was visited (depart/arrive)  
    coursesList.forEach(course => {
        if (!stationsList[course.departureStationId] || !stationsList[course.arrivalStationId]) {
            return;
        }
        let departLocation = stationsList[course.departureStationId].location;
        let arriveLocation = stationsList[course.arrivalStationId].location;
        if (departLocation) {
            if (!locationCounts[departLocation]) {
                locationCounts[departLocation] = 0;
            }
            locationCounts[departLocation]++;
        }
        if (arriveLocation) {
            if (!locationCounts[arriveLocation]) {
                locationCounts[arriveLocation] = 0;
            }
            locationCounts[arriveLocation]++;
        }
    });
    out_file.locationCounts = locationCounts;

    // same but for the rive (only keep gauche and droite, skip "les deux")
    let riveCounts = { "Gauche": 0, "Droite": 0 };
    coursesList.forEach(course => {
        if (stationsList[course.departureStationId]) {
            let departRive = stationsList[course.departureStationId].rive;
            if (departRive != "Les deux") {
                riveCounts[departRive]++;
            }
        }
        if (stationsList[course.arrivalStationId]) {
            let arriveRive = stationsList[course.arrivalStationId].rive;
            if (arriveRive != "Les deux") {
                riveCounts[arriveRive]++;
            }
        }
    });
    out_file.riveCounts = riveCounts;


    // find the trip longer than 2 hours with the highest ratio time/distance, if exists
    let maxRatio = 0;
    let maxRatioTrip = null;
    let maxRatioTripTime = 0;
    coursesList.forEach(course => {
        let time = (new Date(course.endDate) - new Date(course.startDate)) / 1000 / 60 / 60; // in hours
        if (time > 2) {
            let distance = course.distance / 1000; // in km
            let ratio = time / distance;
            if (ratio > maxRatio) {
                maxRatio = ratio;
                maxRatioTrip = course;
                maxRatioTripTime = time;
            }
        }
    });
    out_file.maxRatioTrip = maxRatioTrip;
    out_file.maxRatio = maxRatio;
    out_file.maxRatioTripTime = maxRatioTripTime;

    // reead the file "sunset.json" to get the sunrise and sunset times
    let sunset_file = 'https://veliwrap.delemazure.fr/sunset.json';
    let sunout = await fetch(sunset_file).then(response => response.json());
    let list_days = sunout["results"];

    // create a dict indexed by list_days[i].date and containing list_days[i].sunset
    let sunsetDict = {};
    let sunriseDict = {};
    list_days.forEach(day => {
        sunsetDict[day.date] = day.sunset;
        sunriseDict[day.date] = day.sunrise;
    });

    // count number of time a trip started before the sunset of a day and ended after sunset
    let countSunsetCrossings = 0;
    coursesList.forEach(course => {
        let startDateStr = new Date(course.startDate).toISOString().split('T')[0];
        let endDateStr = new Date(course.endDate).toISOString().split('T')[0];
        let startTime = new Date(course.startDate).toTimeString().split(' ')[0];
        let endTime = new Date(course.endDate).toTimeString().split(' ')[0];
        let sunsetTime = sunsetDict[startDateStr];
        if (sunsetTime) {
            if (startTime < sunsetTime && endTime > sunsetTime) {
                countSunsetCrossings++;
            }
        }
    });
    out_file.countSunsetCrossings = countSunsetCrossings;


    // Group stations together: go by decreasing order of visits, and merge all the stations that are at less than 1km of this one. Save for each "zone", the main station id, the merged stations id, and the total number of visits
    let zones = [];
    let visitedStations = [];
    // sort the stations by number of visits
    let sortedStations = Object.keys(stationsList).sort((a, b) => stationsList[b].count - stationsList[a].count);
    for (let i = 0; i < sortedStations.length; i++) {
        let stationId = sortedStations[i];
        if (visitedStations.includes(stationId)) {
            continue;
        }
        let station = stationsList[stationId];
        let zone = {
            mainStationId: stationId,
            stations: [stationId],
            visits: station.count
        };
        visitedStations.push(stationId);
        // now we look for the stations that are close to this one
        for (let j = i + 1; j < sortedStations.length; j++) {
            let station2Id = sortedStations[j];
            if (visitedStations.includes(station2Id)) {
                continue;
            }
            let station2 = stationsList[station2Id];
            let dist = distancePos(station, station2);
            if (dist < 500) {
                zone.stations.push(station2Id);
                zone.visits += station2.count;
                visitedStations.push(station2Id);
            }
        }
        zones.push(zone);
    }
    out_file.zones = zones;


    // km per day of the week (split elec and mech)
    let kmPerDay = [];
    for (let i = 0; i < 7; i++) {
        kmPerDay.push({ elec: 0, mech: 0 });
    }
    coursesList.forEach(course => {
        let day = new Date(course.startDate).getDay(); // 0 is sunday!!
        if (course.isElectricBike) {
            kmPerDay[day].elec += course.distance;
        } else {
            kmPerDay[day].mech += course.distance;
        }
    });
    out_file.kmPerDay = kmPerDay;

    // km per months (month-year) (split elec and mech)
    let kmPerMonth = {};
    // init for each possible month from firstDay and twelves months before
    // get firstDay str
    let firstDayMonth = firstDay.getMonth();
    let firstDayYear = firstDay.getFullYear();
    for (let i = 0; i < 12; i++) {
        let curr_str = firstDayYear + "-" + firstDayMonth;
        kmPerMonth[curr_str] = { elec: 0, mech: 0 };
        firstDayMonth--;
        if (firstDayMonth < 0) {
            firstDayMonth = 11;
            firstDayYear--;
        }
    }

    coursesList.forEach(course => {
        let monthYear = new Date(course.startDate).getFullYear() + "-" + new Date(course.startDate).getMonth();
        if (!kmPerMonth[monthYear]) {
            return
        }
        if (course.isElectricBike) {
            kmPerMonth[monthYear].elec += course.distance;
        } else {
            kmPerMonth[monthYear].mech += course.distance;
        }
    });
    out_file.kmPerMonth = kmPerMonth;

    // km per hour of the day (split elec and mech)
    let kmPerHour = [];
    for (let i = 0; i < 24; i++) {
        kmPerHour.push({ elec: 0, mech: 0 });
    }
    coursesList.forEach(course => {
        let hour = new Date(course.startDate).getHours();
        if (course.isElectricBike) {
            kmPerHour[hour].elec += course.distance;
        } else {
            kmPerHour[hour].mech += course.distance;
        }
    });

    out_file.kmPerHour = kmPerHour;

    let kmDay = 0;
    let kmNight = 0;
    coursesList.forEach(course => {
        var start = new Date(new Date(course.startDate).getFullYear(), 0, 0);
        var diff = new Date(course.startDate) - start;
        var oneDay = 1000 * 60 * 60 * 24;
        var dayOfTheYear = Math.floor(diff / oneDay);
        // get the sunrise and sunset for this day
        let dateStr = new Date(course.startDate).toISOString().split('T')[0];
        let sunrise = sunriseDict[dateStr];
        let sunset = sunsetDict[dateStr];
        if (!sunrise || !sunset) {
            return;
        }
        let hourRise = parseInt(sunrise.split(':')[0]);
        let minuteRise = hourRise * 60 + parseInt(sunrise.split(':')[1]);
        let hourSet = parseInt(sunset.split(':')[0]);
        let minuteSet = hourSet * 60 + parseInt(sunset.split(':')[1]);


        let hour = new Date(course.startDate).getHours();
        let minute = new Date(course.startDate).getMinutes();
        let time = hour * 60 + minute;
        if (time > minuteRise && time < minuteSet) {
            kmDay += course.distance;
        } else {
            kmNight += course.distance;
        }

    })

    out_file.kmDay = kmDay;
    out_file.kmNight = kmNight;




    out_file.courses = coursesList;

    // Get all courses order by startHour of the day, we only want the time of start,time of end, lon and lat of end and start (only for the trips with a station known)
    let coursesByHour = [];
    coursesList.forEach(course => {
        let startStation = stationsList[course.departureStationId];
        let endStation = stationsList[course.arrivalStationId];
        if (startStation && endStation) {
            let startDate = new Date(course.startDate);
            let endDate = new Date(course.endDate);
            let startHour = startDate.getHours();
            let startMinute = startDate.getMinutes();
            let endHour = endDate.getHours();
            let endMinute = endDate.getMinutes();
            coursesByHour.push({
                startTime: startHour * 60 + startMinute,
                endTime: endHour * 60 + endMinute,
                startLat: startStation.lat,
                startLon: startStation.lon,
                endLat: endStation.lat,
                endLon: endStation.lon
            });
        }
    });
    // sort by startTime
    coursesByHour.sort((a, b) => a.startTime - b.startTime);
    out_file.coursesByHour = coursesByHour;


    // Dans analysis.js, à l'intérieur de ta fonction d'analyse

    // for maxratiotriptime compute hours and minutes
    let maxratiotriptimehours = Math.floor(out_file.maxRatioTripTime);
    let maxratiotriptimeminutes = Math.round((out_file.maxRatioTripTime - maxratiotriptimehours) * 60);
    out_file.maxRatioTripTimeStr = `${maxratiotriptimehours} heures et ${maxratiotriptimeminutes} minutes`;

    // collectionneur: pour les 20 arrondissements de Paris, vérifier si l'utilisateur a visité au moins une station dans chacun d'eux.
    let visited = 0;
    for (let arrondissement = 1; arrondissement <= 20; arrondissement++) {
        // check in locationCounts
        let arrondissementStr = `Paris ${arrondissement}e`;
        if (out_file.locationCounts[arrondissementStr] && out_file.locationCounts[arrondissementStr] > 0) {
            visited++;
        }
    }

    let achievements = {
        km1000: {
            unlocked: out_file.totalDistance >= 1000,
            description: `Vous avez parcouru plus de 1000km cette année ! (${Math.round(out_file.totalDistance)}km au total)`,
            fail: `${Math.round(out_file.totalDistance)}/1000`,
            color: "linear-gradient(135deg, #e4f190, #c68114)"
        },
        tourParis: {
            unlocked: out_file.maxDistanceInADay >= 35,
            description: `Plus de 35km en une journée ! (${Math.round(out_file.maxDistanceInADay)}km le ${maxDistanceInADayDate})`,
            fail: `${Math.round(out_file.maxDistanceInADay)}/35`,
            color: "linear-gradient(135deg, #f190e8, #82148f)"
        },
        enBoucle: {
            // Supposons que tu as calculé le trajet le plus fréquent topTrips[0]
            unlocked: out_file.topTrips[0].count >= 20,
            description: `Même trajet plus de 20 fois ! (${out_file.topTrips[0].count} fois)`,
            fail: `${out_file.topTrips[0].count}/20`,
            color: "linear-gradient(135deg, #8ff0c0, #169d1b)"
        },
        addict: {
            unlocked: out_file.maxStreak >= 10,
            description: `Vous avez roulé au moins 10 jours consécutifs ! (max ${out_file.maxStreak} jours)`,
            fail: `${out_file.maxStreak}/10`,
            color: "linear-gradient(135deg, #eec36c, #d93100)"
        },
        surSeine: {
            unlocked: out_file.countSeineCrossings >= 20,
            description: `Vous avez traversé la Seine plus de 20 fois ! (${out_file.countSeineCrossings} traversées)`,
            fail: `${out_file.countSeineCrossings}/20`,
            color: "linear-gradient(135deg, #45ffe2, #0084ff)"
        },
        cendrillon: {
            unlocked: out_file.countMidnight >= 1,
            description: `Vous avez roulé quand sonnait minuit... (${out_file.countMidnight} fois)`,
            fail: `${out_file.countMidnight}/1`,
            color: "linear-gradient(135deg, #90f0f1, #2367b0)"
        },
        oiseauNuit: {
            unlocked: out_file.countEarlyMorning >= 5,
            description: `Vous avez roulé plus de 5 fois entre 2h et 6h du matin ! (${out_file.countEarlyMorning} fois)`,
            fail: `${out_file.countEarlyMorning}/5`,
            color: "linear-gradient(135deg, #f1d490, #54452d)"
        }, romantique: {
            unlocked: out_file.countSunsetCrossings >= 1,
            description: `Vous avez roulé au coucher du soleil... (${out_file.countSunsetCrossings} fois)`,
            fail: `${out_file.countSunsetCrossings}/1`,
            color: "linear-gradient(135deg, #fcd1d8, #d64580)"
        }, teteEnLair: {
            unlocked: out_file.maxRatioTrip != null && out_file.maxRatio >= 0.25,
            description: `Vous avez laissé votre vélib sans que la course ne soit terminée ! (${out_file.maxRatioTripTimeStr})`,
            fail: '???',
            color: "linear-gradient(135deg, #f79e5b, #e32626)"
        },
        collectionneur: {
            unlocked: visited === 20,
            description: `Vous avez visité au moins une station dans chacun des 20 arrondissements de Paris !`,
            fail: `${visited}/20`,
            color: "linear-gradient(135deg, #ffebfd, #444752)"
        }
    };
    out_file.achievements = achievements;

    return out_file;
}
