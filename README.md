# Universal Model for Vue

Universal model is a model which can be used with any of following UI frameworks:
* Angular 2+
* React 16.8+
* Svelte 3+
* Vue.js 3+

![alt text](https://github.com/universal-model/universal-model-vue/raw/master/images/mvc.png "MVC")

## Clean UI Architecture
* Model-View-Controller (https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)
* User triggers actions by using view or controller
* Actions are part of model and they manipulate state that is stored
* Actions can use services to interact with external (backend) systems
* State changes trigger view updates
* Selectors select and calculate a transformed version of state that causes view updates
* Views contain NO business logic
* There can be multiple interchangable views that use same part of model
* A new view can be created to represent model differently without any changes to model


