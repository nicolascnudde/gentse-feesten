const EVENTS_API = 'https://www.pgm.gent/data/gentsefeesten/events_500.json';
const CATEGORIES_API = 'https://www.pgm.gent/data/gentsefeesten/categories.json';

(() => {

  const app = {

    initialize () {
      this.cacheElements();
      this.registerListeners();
      this.fetchCategories();
    },

    cacheElements () {
      this.$nav = document.querySelector('.nav-list');
      this.$ham = document.querySelector('.ham-menu');
      this.$subToggle = document.querySelector('.sub-toggle');
      this.$events = document.querySelector('.event__list');
      this.$eventCard = document.querySelector('.event__card');
      this.$categories = document.querySelector('.categories__list');
      this.$content = document.querySelector('.content');
      this.$gridToggle = document.querySelector('.grid-toggle');
      this.$listToggle = document.querySelector('.list-toggle')
      this.$details = document.querySelector('.details')
    },

    registerListeners () {
      this.$ham.addEventListener('click', () => {
        this.$ham.classList.toggle('open');
      });
      this.$subToggle.addEventListener('click', () => {
        this.$subToggle.classList.toggle('active');
      });
      if (this.$gridToggle !== null) {      
        this.$gridToggle.addEventListener('click', () => {
          this.$content.classList.remove('list');
        })
      };    
      if (this.$listToggle !== null) {
        this.$listToggle.addEventListener('click', () => {
          this.$content.classList.add('list');
        });
      }
    },

    fetchCategories () {
      fetch(CATEGORIES_API)
        .then((response) => response.json())
        .then((json) => {
          this.categories = json;
          this.generateHTMLForCategories();
          this.fetchEvents();
        })
        .catch((error) => console.error(error));
    },

    fetchEvents () {
      fetch(EVENTS_API)
        .then((response) => response.json())
        .then((json) => {
          this.events = json;
          this.generateHTMLForThreeEvents();
          this.generateHTMLForCategoriesAndEvents();
          this.generateHTMLForDetail();
        })
        .catch((error) => console.error(error));
    },

    generateHTMLForCategories () {
      if (this.$categories !== null) {
      this.$categories.innerHTML = this.categories.map((category) => {
        return `
        <li class="categories__list--item">
          <a href="#${category}">${category}</a>
        </li>`
      }).join('');
    }
    },

    generateHTMLForThreeEvents () {
      if (this.$events !== null) {
        const params = new URLSearchParams(window.location.search);

        const urlType = params.get('day');
        if (urlType !== null) {
          this.events = this.events.filter(event => event.day === urlType)
        }

        for (let i = 0; i <= 2; i++) {
        let randomEvent = this.events[Math.floor(Math.random() * this.events.length)];
        let tempStr = '';  
            tempStr += `
            <li class="event__list--item">
              <a class="event__link" href="detail.html?day=${randomEvent.day}&slug=${randomEvent.slug}">
                <article class="event__card">
                  <img class="event__card--img" src="${randomEvent.image ? randomEvent.image.thumb : 'static/media/fallback.jpg'}">
                    <div class="event__card__container">
                      <p class="event--time">${randomEvent.day === urlType ? '' : randomEvent.day_of_week} ${randomEvent.day === urlType ? '' : randomEvent.day} ${randomEvent.day === urlType ? '' : 'Jul'} ${randomEvent.start} u.</p>
                    </div>
                    <h3 class="event--title">${randomEvent.title}</h3>
                    <p class="event--location">${randomEvent.location}</p>
                </article>
              </a>
            </li>
            `;
        this.$events.innerHTML += tempStr;
        }
      };
    },

    generateHTMLForCategoriesAndEvents () {
      if (this.$content !== null) { 
        const params = new URLSearchParams(window.location.search);

        const urlType = params.get('day');
        if (urlType !== null) {
          this.events = this.events.filter(event => event.day === urlType)
        }

        const tempStr = this.categories.map((category) => {
          const eventFilter = this.events.filter((event) => {
            return event.category.indexOf(category) > -1;
          });

          eventFilter.sort((event1, event2) => {
            return event1.sort_key.localeCompare(event2.sort_key);
          })

          const items = eventFilter.map((event) => {
            return `
              <li class="event__list--item">
                <a class="event__link" href="detail.html?day=${event.day}&slug=${event.slug}">
                  <article class="event__card">
                    <img class="event__card--img" src="${event.image ? event.image.thumb : 'static/media/fallback.jpg'}">
                    <div class="event__card__container">
                      <p class="event--time">${event.start} u.</p>
                    </div>
                    <div class="event__card--title">
                      <h3 class="event--title">${event.title}</h3>
                    </div>
                    <div class="event__card--location">
                      <p class="event--location">${event.location}</p>
                    </div>
                  </article>
                </a>
              </li>
            `;
          }).join('');

          return `
            <section>
              <div class="content--h2">
                <h2 id="${category}">${category}</h2>
                <a class="content--link" href="#categories">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32">
                  <title>Terug naar boven</title>
                  <path d="M13.682 11.791l-6.617 6.296-3.065-2.916 11.74-11.171 12.26 11.665-2.935 2.793-7.113-6.768v16.311h-4.269z"></path>
                </svg>
                </a>
              </div>
              <ul class="content__list">
                ${items}
              </ul>
            </section>`
        }).join('');

        this.$content.innerHTML = tempStr;
      }
    },

    generateHTMLForDetail () {
      if (this.$details !== null) {
        const params = new URLSearchParams(window.location.search);

        const urlDay = params.get('day');
        if (urlDay !== null) {
          this.events = this.events.filter(event => event.day === urlDay)
        }

        const urlSlug = params.get('slug');
        if (urlSlug !== null) {
          this.events = this.events.filter(event => event.slug === urlSlug)
        }

        const content = this.events.map((event) => {
          return `
          <div class="detail-title">
            <h1>${event.title}</h1>
            <a class="detail-location-url" href="#">${event.location}</a>
            <h2 class="detail-time">${event.day_of_week} ${event.day} juli – ${event.start}u <span>${event.end}u</span></h2>
          </div>
          <div class="detail-container">
            <div class="detail__image">
              <img src="${event.image ? event.image.full : 'static/media/fallback.jpg'}" alt="${event.slug}">
            </div>
            <div class="detail__content">
              <p>${event.description ? event.description : 'Binnenkort meer info!'}</p>
              <div class="detail__content-fields">
                <div class="detail__content__label">
                  <p>Website:</p>
                </div>
                <div class="detail__content__item detail__content__item-1">
                <a href="${event.url !== null ? event.url : '#'}">${event.url !== null ? event.url : 'Geen website'}</a>
                </div>
              </div>
              <div class="detail__content-fields">
                <div class="detail__content__label">
                  <p>Organisator:</p>
                </div>
                <div class="detail__content__item">
                <a href="#">${event.organizer}</a>
                </div>
              </div>
              <div class="detail__content-fields">
                <div class="detail__content__label">
                  <p>Categorieën:</p>
                </div>
                <div class="detail__content__item">
                <a href="#">${event.category}</a>
                </div>
              </div>
            </div>
          </div>
          `
        }).join('');
        this.$details.innerHTML = content;
      }
    }

  };

  app.initialize();

})();