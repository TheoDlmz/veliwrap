
    const maxpages = 15;
    // create {maxpages} pages of class wrap-page (empty)

    for (let i = 1; i <= maxpages; i++) {
        let page = document.createElement('div');
        page.id = 'page-' + i;
        page.className = 'wrap-page';
        if (i != 1) {
            page.style.display = 'none';
        }
        document.getElementById('wrap-content').appendChild(page);
    }

    // function to change pages 

    function update() {
        showPage();
        if (currentPage === 1) {
            document.getElementById('button-prev').classList.remove('active');
        } else {
            document.getElementById('button-prev').classList.add('active');
        }
        if (currentPage === maxpages) {
            document.getElementById('button-next').classList.remove('active');
        } else {
            document.getElementById('button-next').classList.add('active');
        }
    }

    let currentPage = 1;
    document.getElementById('next').addEventListener('click', function () {
        if (currentPage < maxpages) {
            document.getElementById('page-' + currentPage).style.display = 'none';
            currentPage++;
            document.getElementById('page-' + currentPage).style.display = 'flex';
            update();
        }
    });
    document.getElementById('prev').addEventListener('click', function () {
        if (currentPage > 1) {
            document.getElementById('page-' + currentPage).style.display = 'none';
            currentPage--;
            document.getElementById('page-' + currentPage).style.display = 'flex';
            update();
        }
    });


    // show page

    function showPage() {
        switch (currentPage) {
            case 1:
                showPage1(results);
                break;
            case 2:
                showPage2(results);
                break;
            case 3:
                showPage3(results);
                break;
            case 4:
                showPage4(results);
                break;
            case 5:
                showPage5(results);
                break;
            case 6:
                showPage6(results);
                break;
            case 7:
                showPage7(results);
                break;
            case 8:
                showPage8(results);
                break;
            case 9:
                showPage9(results);
                break;
            case 10:
                showPage10(results);
                break;
            case 11:
                showPage11(results);
                break;
            case 12:
                showPage12(results);
                break;
            case 13:
                showPage13(results);
                break;
            case 14:
                showPage14(results);
                break;
            case 15:
                showPage15(results);
                break;
        }
    }




    function showWrap() {


        // display the wrap div
        document.getElementById('wrap').style.display = 'flex';

        showPage();


    }


    // collapse the explication div
    function collapseDiv(div) {
        div.style.opacity = 0;
        setTimeout(() => {
            div.style.display = 'none';
        }, 1000);
    }

    let results;

    function startWrap(allCourses, stations) {
        getData(allCourses, stations).then((res) => {
            results = res;
            collapseDiv(document.getElementById('acceuil'));
            // wait a second and display the wrap div
            setTimeout(() => {
                showWrap();
            }, 1000);
        }).catch((error) => {
            // Affiche l'alerte en cas d'erreur
            console.error("Erreur lors de la récupération des données:", error);
            alert("Une erreur est survenue lors de l'analyse de vos données : \n" + (error.message || error));
        });
    }


    document.getElementById('file').addEventListener('change', function () {
        var fr = new FileReader();
        fr.onload = function () {
            var data = JSON.parse(fr.result);
            let allCourses = data.walletOperations;
            fetch('https://veliwrap.delemazure.fr/stations_w_loc.json')
                .then(response => response.json())
                .then(data => {
                    let stations = data.data.stations;
                    startWrap(allCourses, stations);
                })
        }
        fr.readAsText(this.files[0]);
    });