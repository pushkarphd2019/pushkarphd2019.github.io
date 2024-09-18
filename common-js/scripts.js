
(function ($) {

    "use strict";
	
	

	// LINE PROGRESS BAR
	enableLineProgress();
	
	// RADIAL PROGRESS BAR
	enableRadialProgress();
	
	// ACCORDIAN
	panelAccordian();

	$(window).on('load', function(){
		
		// ISOTOPE PORTFOLIO WITH FILTER
		if(isExists('.portfolioContainer')){
			var $container = $('.portfolioContainer');
			$container.isotope({
				filter: '*',
				animationOptions: {
					duration: 750,
					easing: 'linear',
					queue: false
				}
			});
		 
			$('.portfolioFilter a').click(function(){
				$('.portfolioFilter .current').removeClass('current');
				$(this).addClass('current');
		 
				var selector = $(this).attr('data-filter');
				$container.isotope({
					filter: selector,
					animationOptions: {
						duration: 750,
						easing: 'linear',
						queue: false
					}
				 });
				 return false;
			}); 
		}
	
	});
	
	
	$('a[href="#"]').on('click', function(event){
		return;
	});
	
	
	if ( $.isFunction($.fn.fluidbox) ) {
		$('a').fluidbox();
	}
	
	var countCounterUp = 0;
	
	var a = 0 ;
	
	countCounterUp = enableCounterUp(countCounterUp);
	
	$(window).on('scroll', function(){
		
		countCounterUp = enableCounterUp(countCounterUp);
	
	});
	
	
})(jQuery);

function panelAccordian(){
	
	var panelTitle = $('.panel-title');
	panelTitle.on('click', function(){
		$('.panel-title').removeClass('active');
		$(this).toggleClass('active');
		
	});
	
}

function enableRadialProgress(){
	
	$(".radial-progress").each(function(){
		var $this = $(this),
			progPercent = $this.data('prog-percent');
			
		var bar = new ProgressBar.Circle(this, {
			color: '#aaa',
			strokeWidth: 3,
			trailWidth: 1,
			easing: 'easeInOut',
			duration: 1400,
			text: {
				
			},
			from: { color: '#aaa', width: 1 },
			to: { color: '#FEAE01', width: 3 },
			// Set default step function for all animate calls
			step: function(state, circle) {
				circle.path.setAttribute('stroke', state.color);
				circle.path.setAttribute('stroke-width', state.width);

				var value = Math.round(circle.value() * 100);
				if (value === 0) {
					circle.setText('');
				} else {
					circle.setText(value);
				}

			}
		});
		
		$(this).waypoint(function(){
		   bar.animate(progPercent);  
		},{offset: "90%"})
		
	});
}

function enableLineProgress(){
	
	$(".line-progress").each(function(){
		var $this = $(this),
			progPercent = $this.data('prog-percent');
			
		var bar = new ProgressBar.Line(this, {
			strokeWidth: 1,
			easing: 'easeInOut',
			duration: 1400,
			color: '#FEAE01',
			trailColor: '#eee',
			trailWidth: 1,
			svgStyle: {width: '100%', height: '100%'},
			text: {
				style: {
					
				},
			},
			from: {color: '#FFEA82'},
			to: {color: '#ED6A5A'},
			step: (state, bar) => {
				bar.setText(Math.round(bar.value() * 100) + ' %');
			}
		});
		
		$(this).waypoint(function(){
		   bar.animate(progPercent);  
		},{offset: "90%"})
		
	});
}

function enableCounterUp(a){
	
	var counterElement;
	
	if(isExists('#counter')){ counterElement = $('#counter'); }
	else{ return; }
		
	var oTop = $('#counter').offset().top - window.innerHeight;
	if (a == 0 && $(window).scrollTop() > oTop) {
		$('.counter-value').each(function() {
			var $this = $(this),
				countDuration = $this.data('duration'),
				countTo = $this.attr('data-count');
			$({
				countNum: $this.text()
			}).animate({
				countNum: countTo
			},{

				duration: countDuration,
				easing: 'swing',
				step: function() {
					$this.text(Math.floor(this.countNum));
				},
				complete: function() {
					$this.text(this.countNum);
				}

			});
		});
		a = 1;
	}

	return a;
}

function isExists(elem){
	if ($(elem).length > 0) { 
		return true;
	}
	return false;
}


var currentPage = 1;
var itemsPerPage = 2; // Number of items per page
var currentFilter = 'all'; // Default filter is 'all'

// Filter and paginate publications
function filterPublications(type) {
  currentFilter = type;
  currentPage = 1; // Reset to page 1 on filter change

  updateActiveFilter(type);
  displayPublications();
}

function updateActiveFilter(type) {
	// Remove the active class from all filters
	document.querySelectorAll('.font-yellow').forEach(function (filterLink) {
	  filterLink.classList.remove('active-filter');
	});
  
	// Add the active class to the selected filter
	if (type === 'all') {
	  document.getElementById('all-filter').classList.add('active-filter');
	} else if (type === 'journal') {
	  document.getElementById('journal-filter').classList.add('active-filter');
	} else if (type === 'conf') {
	  document.getElementById('conf-filter').classList.add('active-filter');
	} else if (type === 'book-chapter') {
	  document.getElementById('book-chapter-filter').classList.add('active-filter');
	}
  }

function displayPublications() {
  var publications = document.querySelectorAll('.pub');
  var visibleItems = 0;

  // Calculate total visible items for the current filter
  publications.forEach(function (pub) {
    if (currentFilter === 'all' || pub.classList.contains(currentFilter)) {
      visibleItems++;
    }
  });

  // Calculate start and end indexes for pagination
  var start = (currentPage - 1) * itemsPerPage;
  var end = start + itemsPerPage;
  var visibleCount = 0;

  // Show or hide items based on pagination and filter
  publications.forEach(function (pub, index) {
    if (currentFilter === 'all' || pub.classList.contains(currentFilter)) {
      if (visibleCount >= start && visibleCount < end) {
        pub.style.display = 'block'; // Show items within the current page range
      } else {
        pub.style.display = 'none'; // Hide items outside the range
      }
      visibleCount++;
    } else {
      pub.style.display = 'none'; // Hide items not matching the filter
    }
  });

  updatePaginationControls(visibleItems);
}

// Update pagination controls (buttons and page indicator)
function updatePaginationControls(totalItems) {
  var totalPages = Math.ceil(totalItems / itemsPerPage);
  document.getElementById('page-indicator').innerText = 'Page ' + currentPage + ' of ' + totalPages;

  // Disable "Previous" button on the first page
  document.querySelector('button[onclick="previousPage()"]').disabled = currentPage === 1;

  // Disable "Next" button on the last page
  document.querySelector('button[onclick="nextPage()"]').disabled = currentPage === totalPages || totalPages === 0;
}

function nextPage() {
  currentPage++;
  displayPublications();
}

function previousPage() {
  currentPage--;
  displayPublications();
}

// Initial display of publications
displayPublications();


