$( document ).ready( function() {
	/*$( 'a' ).click( function( event ) {
        event.preventDefault();
    });*/
	
	 //  =========== index page ===================

    var owl = $('.part');
    owl.owlCarousel({
        loop: true,
        center: true,
        margin: 20,
        autoplay: true,
        autoplayTimeout: 1000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 2
            },
            600: {
                items: 3
            },
            1000: {
                items: 6
            }
        }
    });
    $('.play').on('click', function () {
        owl.trigger('play.owl.autoplay', [4000])
    })
    $('.stop').on('click', function () {
        owl.trigger('stop.owl.autoplay')
    });
	
	//===========  About-us page ===================
    var owl1 = $( '.part1' );
    owl1.owlCarousel({
        loop: true,
        center: true,
        margin: 20,
        autoplay: true,
        autoplayTimeout: 1000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 3
            },
            1000: {
                items: 4
            }
        }
    });
    $( '.play' ).on( 'click', function () {
        owl1.trigger( 'play.owl.autoplay', [4000])
    })
    $( '.stop' ).on( 'click', function () {
        owl1.trigger( 'stop.owl.autoplay' )
    });	
});
/*
// section-1 (Chart)
const chartData = {
    data: [50, 22, 17, 10],
};
const myChart1 = document.querySelector(".my-chart");
new Chart(myChart1, {
    type: "doughnut",
    data: {
        datasets: [
            {
                label: "Language Popularity",
                data: chartData.data,
            },
        ],
    },
    options: {
        borderWidth: 1,
        borderRadius: 2,
        hoverBorderWidth: 0,
        plugins: {
            legend: {
                display: false,
            },
        },
    },
});*/
  

