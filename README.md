# Vue Star Wars Info by Matthew Chan

## _**Intro**_

This webapp was made by me with **Vue.js** and **Vuex** mainly as an effort to familiarize myself more with the technology. It was completed in roughly half a day's total time and connects to the [SWAPI](https://swapi.co/) to fetch Star Wars related data.

For this project the visuals were not emphasized, hence the lack of stylesheets; in fact the initial part of the project was five hours of coding before any visual progress even reflected on the page. This is because I wanted to carefully consider the structure of the app, how it might perform, be scalable, modular, etc. Based on the nature of the API and how it returned data.

## _**Video Demo**_

https://drive.google.com/open?id=10-si-YiOXpNFjnzk9sUJTJdNd04aqU6l

## _**User Flow**_

- Initial page displays a list of films. The user can filter via a simple search for the film's title or "opening crawl".
- The other type of page is the Detail page, which displays both metadata/fields pertaining to the current object, as well as collections of ResourceList components to the right.
- When interacting with these lists, they each fetch from the store/API to grab even more detailed data.
- Essentially all the detail pages are connected in some way, as they each have a collection of links linking to one another.

## _**Dev Notes**_

- About optimization:
    - The heaviest API calls involved querying for film characters. As such, I used Promise.all to run over a dozen AJAX requests parallel to one another, before all resolving and rendering on the interface.
    - Vuex is used to cache _already fetched_ API data. So if in the same session (without reloading) the user happens to stumble upon familiar data, it will fetch from the Vuex store instead of the API.
    - Loading animations are placed strategically to reduce the sense of waiting on the user's end.
    - A powerful caching strategy (not used here) is to employ PHP or a backend language to cache results from the API. Then, using a cron job it might be possible to "ping" the server periodically (maybe once a day) to refresh or re-cache the data. This way, the user will consistently have a very fast web experience since the site seldom needs to actually call the API.

## _**Possible Improvements**_

- Display meaningful error messages to the user; ErrorLogger.vue is a prototype of this purpose as it captures errors coming through the Vuex store. It's possible to either then log these errors somewhere in the filesystem or database, or even render them on page sequentially, then disappearing one at a time after intervals.
- Pagination/better UI.
- Breadcrumbs to let the user easily trace their steps/return to a previous page.
- Site-wide search instead of just for films.
- As mentioned above, a PHP backend to possibly perform persistent caching.