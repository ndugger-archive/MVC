MVC Server in io.js
===================

This is just for learning, at least for now, anyways. The server/ folder is the MVC 'library', and the rest is just a test app that utilizes it.

Modeled after .NET MVC (as far as architecture goes), you will have 3 important folders:

- app
- public
- views

**app:**

This is where you keep the 'app code' like controllers, models, and the **routing file**.

**public:**

This is where you put your publically served resources, like javascript and css.

**views:**

This is obviously for your views. create a folder that matches your controller, and put action's views inside of there.
____________________________________________________________

**Routing:**

Inside of the app/routes.json file, you'll put your routes. This gets read when the server starts, and each request checks for a matching route. It should look something like:

    {
    	"/": {
    		"controller": "Home",
    		"action": "index"
    	},
    	"/{foo}/{bar}": {
    		"controller": "Home",
    		"action": "foo"
    	}
    }

Routing allows for grabbing parameters from a URL, and stores them in `request.parameters`. This can, then, be used in the controller.
____________________________________________________________

**WIP Templating:**

Layouts are possible, meaing that you can have a master layout that you set for use in the view.

*master.html* (layout file)

    <!doctype html>
    <html>
    	<head>
    		<title>@{title}</title>
    	</head>
    	<body>
    		@{render body}
    	</body>
    </html>
  
*home/foo.html* (view file)

    @{layout master}
    
    <h2>@{foo.bar}</h2>
    
    <p>Lorem ipsum dolor sit amet, @{foo.baz.hoo}</p>
    
    @{each people->person}
    	<div>
    		<b>@{person.name}:</b> @{person.age}
    	</div>
    @{/each}
  
Notice, above, that you can also use loops to display each item from an array (from the data). This is done by aliasing each iteration (`people->person`).
____________________________________________________________

**Current Features:**

- Routing
- Controllers
- Templating
  - Data insertion
  - Loops
  - Layouts
- File serving

**Working On:**

- More templating features (especially partials)
- Synchronous file serving
- More!?
