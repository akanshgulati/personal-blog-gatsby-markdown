---
title: 'How to Add Transition on Text Changes'
date: 2020-07-15T00:00:00+5:30
draft: false
feature_image: text-change-transitions.png
featured: false
published_at: 2020-07-15T00:00:00+5:30
updated_at: 2020-07-15T00:00:00+5:30
created_at: 2020-07-15T00:00:00+5:30
weight: 2
page: false
tags: 
    - react
    - javascript
    - vue
slug: 'how-to-add-text-change-transition'
author: 'akansh'
comment: true
meta_description: ''
id: 'text-change-transitions-react-vue'
---

Text transitions are usually preferred when you need to notify user of any text 
being changed on screen and it just not make experience better, but, also 
important when text values changes on the basis of the user actions on the screen.

> For example, if you're on an e-commerce website and read the price of
> an item, but, you changed the quantity of the item and suddenly your
> shipping charges are increased, making it important to highlight those
> changes to user.

I believe this is one of the use-case where text transitions are required, 
also, React and Vue frameworks supports Hot Module Replacement, updating only the particular modules. See the example below to understand how simple text transition can have impact on user experience. 

For example: 

![animated correct ](./animation-correct.gif)

## Vue JS Implementation

Vue has in-built `<Transition>` making it much easier to use it. We specify mode as `out-in` so that the new text can come exactly at the place where previous text is there, otherwise you will see a text flickering horizontally.  Read more about mode [here](https://vuejs.org/v2/guide/transitions.html).

<iframe src="https://codesandbox.io/embed/vue-text-transition-example-nlvog?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Vue: Text Transition Example"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

<br>

##  React Implementation

In React, we have to use two different components, `CSSTransition` and `SwitchTransition`. 
CSSTransition handles the transition on the content, like the timeout, transition class name, etc.,SwitchTransition helps in setting the mode just like Vue in `out-in` order. You can read more about various options [here](http://reactcommunity.org/react-transition-group/css-transition).

> You need to specifically mention `key` attribute of the
> SwitchTransition child so that it can identify content change.


<iframe
     src="https://codesandbox.io/embed/react-text-replace-transition-cz08h?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="React: Text Replace Transition"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

<br>

## Vanilla JS Implementation

We are removing and adding the same `fade-in` class with changed text content, the timeout part is being handled with `setTimeout` method and `requestAnimationFrame` callback to prevent any jank experience. 

> By default, we add fade out related properties to `.text` class so
> that once `fade-in` class is removed, it can work as just like
> `leave-active` in React and Vue.

<iframe
     src="https://codesandbox.io/embed/vanilla-js-text-transition-example-hc7kq?fontsize=14&hidenavigation=1&theme=dark&view=preview"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Vanilla JS : Text Transition Example"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

<br/>
Hope you got some basic idea about how implementation is different as per framework and in vanilla JS. 
