const ChangeState = function(selector, prevState = 0){
	
	let state = Math.floor( Math.random()*(5-1) + 1 );
	if( state == prevState ){
		return ChangeState(selector, state);
	}

	let style = document.querySelector(selector).style;

	switch( state ){
		case 1:
			style.backgroundColor = '#90EE90';
			break;
		case 2:
			style.backgroundColor = 'lightgray';
			break;
		case 3:
			style.backgroundColor = '#6495ED';
			break;
		case 4:
			style.backgroundColor = 'lightblue';
			break;
		default:
			style.backgroundColor = 'orange';
			break;
	}
	//console.log(state);
	setTimeout( () => ChangeState(selector, state), 1000 );
};

ChangeState('.lamp_itself',true, 1);