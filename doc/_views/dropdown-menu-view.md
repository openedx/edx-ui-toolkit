---
title: dropdown-menu/dropdown-menu-view
requirePath: edx-ui-toolkit/js/dropdown-menu/dropdown-menu-view
githubPath: blob/master/src/js/dropdown-menu/dropdown-menu-view.js
viewClass: view
---

# Global





* * *

## Class: DropdownMenuView
To render a Dropdown Menu View which is fully accessible

 Initialize the view by passing in the following attributes
 className: 'space separated string of classes for element',
 model: with the following attributes (example values added)
     main: {
         image: 'http://placehold.it/40x40'',
         screenreader_label: 'Dashboard for: ',
         text: 'username',
         url: 'dashboard'
     },
     button: {
         icon: 'icon-angle-down',
         label: 'User options dropdown'
     },
     items: [
         {
             text: 'Dashboard',
             url: 'dashboard'
         }, {
             text: 'Account',
             url: 'account_settings'
         }, {
             text: 'Profile',
             url: 'learner_profile'
         }, {
             text: 'Sign Out',
             url: 'logout'
         }
     ]
 parent: 'selecter for parent element that will be replaced with dropdown menu'

**$btn**:  , If there is a parent dropdown button
 that is the element to test
### DropdownMenuView.analyticsLinkClick() 

Function to track analytics
By default it doesn't do anything, to utilize please
extend the View (example code commented out in the function)




* * *










