import { Injectable } from '@angular/core';
import $ from 'jquery';
import 'owl.carousel'; // Ensure you have the Owl Carousel library installed
import 'waypoints/lib/jquery.waypoints.min.js'; // Ensure you have the Waypoints library installed
import 'counterup2'; // Ensure you have the CounterUp library installed

declare global {
  interface JQuery {
    waypoint(handler: (direction: string) => void, options?: any): JQuery;
    counterUp(options?: any): JQuery;
  }
}

declare global {
  interface JQuery {
    owlCarousel(options?: any): JQuery;
  }
}

@Injectable({
  providedIn: 'root'
})
export class JqueryService {

  constructor() { }

  // Loader functionality
  public loader(): void {
    setTimeout(() => {
      if ($('#loader').length > 0) {
        $('#loader').removeClass('show');
      }
    }, 1);
  }

  // Back to top button functionality
  public initBackToTopButton(): void {
    $(window).on('scroll', () => {
      if ($(window).scrollTop() > 200) {
        $('.back-to-top').fadeIn('slow');
      } else {
        $('.back-to-top').fadeOut('slow');
      }
    });

    $('.back-to-top').on('click', () => {
      $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
      return false;
    });
  }

  // Sticky Navbar functionality
  public initStickyNavbar(): void {
    $(window).on('scroll', () => {
      if ($(window)!.scrollTop() > 0) {
        $('.navbar').addClass('nav-sticky');
      } else {
        $('.navbar').removeClass('nav-sticky');
      }
    });
  }

  // Dropdown hover functionality
  public initDropdownHover(): void {
    const toggleNavbarMethod = () => {
      if ($(window).width()! > 992) {
        $('.navbar .dropdown').on('mouseover', function () {
          $('.dropdown-toggle', this).trigger('click');
        }).on('mouseout', function () {
          $('.dropdown-toggle', this).trigger('click').blur();
        });
      } else {
        $('.navbar .dropdown').off('mouseover').off('mouseout');
      }
    };
    toggleNavbarMethod();
    $(window).on('resize', toggleNavbarMethod);
  }

  // Main carousel functionality
  public initMainCarousel(): void {
    $(".carousel .owl-carousel").owlCarousel({
      autoplay: true,
      animateOut: 'fadeOut',
      animateIn: 'fadeIn',
      items: 1,
      smartSpeed: 300,
      dots: false,
      loop: true,
      nav: true,
      navText: [
        '<i class="fa fa-angle-left" aria-hidden="true"></i>',
        '<i class="fa fa-angle-right" aria-hidden="true"></i>'
      ]
    });
  }

  // Causes carousel functionality
  public initCausesCarousel(): void {
    $(".causes-carousel").owlCarousel({
      autoplay: true,
      animateIn: 'slideInDown',
      animateOut: 'slideOutDown',
      items: 1,
      smartSpeed: 450,
      dots: false,
      loop: true,
      responsive: {
        0: { items: 1 },
        576: { items: 1 },
        768: { items: 2 },
        992: { items: 3 }
      }
    });
  }

  // Causes progress functionality
  public initProgress(): void {
    $('.causes-progress').waypoint(() => {
      $('.progress .progress-bar').each(function () {
        $(this).css("width", $(this).attr("aria-valuenow") + '%');
      });
    }, { offset: '80%' });
  }

  // Counter functionality
  public initCounter(): void {
    $('[data-toggle="counter-up"]').counterUp({
      delay: 10,
      time: 2000
    });
  }

  // Testimonials carousel functionality
  public initTestimonialsCarousel(): void {
    $(".testimonials-carousel").owlCarousel({
      center: true,
      autoplay: true,
      dots: true,
      loop: true,
      responsive: {
        0: { items: 1 },
        576: { items: 1 },
        768: { items: 2 },
        992: { items: 3 }
      }
    });
  }

  // Related post carousel functionality
  public initRelatedPostCarousel(): void {
    $(".related-slider").owlCarousel({
      autoplay: true,
      dots: false,
      loop: true,
      nav: true,
      navText: [
        '<i class="fa fa-angle-left" aria-hidden="true"></i>',
        '<i class="fa fa-angle-right" aria-hidden="true"></i>'
      ],
      responsive: {
        0: { items: 1 },
        576: { items: 1 },
        768: { items: 2 }
      }
    });
  }
}