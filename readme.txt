implemented the code using express (node js) and mongo db for database
Following is the description of the rest api points being used :-
There are 2 router paths :-
1./eventRouter :- 1./register(using the post request call where in the body the 	category name , genre name and email has been added).
				  2./getEvents(using the get request call which determines which user is currently logged in from the web token and extracts the event info by making an http call , currently hardcoding the username and password being provided )
				  3./setPreferences :- used to update the user preferences using put operation
2./users :- used to sign users up , login maintain sessions , authenticate function is code which can be used by other api calls thus used in eventRouter
				



