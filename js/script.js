// Create the event.
var countClickEvent = new Event('countClick',{ bubbles: true, cancelable: true });


const ShopHelper = new function(){

	/**
		Creates new objects that discribes single chart.
		Return empty object on any error with .id = 0.
	*/
	this.getChartElement = ( buttonElement ) => {
		let obj = {
			id: 0,
			title: '',
			price: 0,
			priceText: '',
			discount: 0,
			discountText: '',
			calculate: function(){
				return ( this.price * ( 1 - this.discount / 100 ) );
			}
		};  
		try{
			let parent = buttonElement.parentNode;
			obj.title = parent.querySelector('.stuff__title').innerText;
			obj.id = parent.querySelector('.stuff__id span:last-child').innerText;
			obj.price = parseInt( parent.querySelector('.stuff__content-price').innerText );
			obj.priceText = obj.price + parent.querySelector('.stuff__content-price span:last-child').innerText;
			obj.discount = parseInt( parent.querySelector('.stuff__content-discount').innerText );
			obj.discountText = obj.discount + ' %';
		}catch(e){
			console.log('Ошибка обратки блока товара (поменялась структура)');
			console.log(e);
		}finally{
			return obj;
		}
	}


	/**
		Creates basket element of the related chart element
	*/
	this.createBasketElement = ( chartElement = null ) =>{
		
		/* This element represents one Basket element with inputs their properties */
		let obj = {
			id: 0,
			count: 0,
			li: null,
			relatedChart: chartElement, // link to chart element
			titleBlock: null,
			discountBlock: null,
			countBlock: null,
			priceBlock: null,
			getHtmlElement: function(){
				if( this.li == null ){ return false; }
				return this.li;
			},
			setTitle: function(text){
				if( this.titleBlock == null ) {return false;}
				this.titleBlock.innerText = text;
				return true; 
			},
			setDiscount: function(value){
				if( this.discountBlock == null ) {return false;}
				this.discountBlock.value = value;
				return true; 
			},
			setCount: function(value){
				if( this.countBlock == null ) {return false;}
				this.countBlock.value = value;
				return true; 
			},
			setPrice: function(value){
				if( this.priceBlock == null ) {return false;}
				this.priceBlock.value = value;
				return true; 
			},
			getTitle: function(){
				if( this.titleBlock == null ) {return '';}
				return this.titleBlock.innerText;
			},
			getDiscount: function(){
				if( this.discountBlock == null ) {return '';}
				return this.discountBlock.value;
			},
			getCount: function(value){
				if( this.countBlock == null ) {return '';}
				return this.countBlock.value;
			},
			getPrice: function(value){
				if( this.priceBlock == null ) {return '';}
				return this.priceBlock.value;
			},
			load: function(chartElement){

				if(this.isExists() === false){ return false; }
				
				this.count++;
				this.id = chartElement.id;
				this.setDiscount( chartElement.discount );
				this.setTitle( chartElement.title );
				this.setPrice( (chartElement.calculate() * this.count).toFixed(2) );
				this.setCount(this.count);

				return true;
			},
			calculate: function(){
				this.count = this.getCount();
				this.setPrice( (this.relatedChart.calculate() * this.count).toFixed(2) );
			},
			isExists: function(){
				if( this.li != null){
					return this.li;
				}
				return false;
			},
			updateElement: function(chartElement){
				if(this.id != chartElement.id){return false;}
				return this.load(chartElement);
			},
			genereteElement: function(){	
				if( this.relatedChart == null ){ return false; }

				//basket element
				this.li = document.createElement('li');
				this.li.dataset.id = this.relatedChart.id;
				this.li.className = 'chart-element';

				this.titleBlock = document.createElement('p');
				this.li.append(this.titleBlock);

				this.discountBlock = document.createElement('input');
				this.discountBlock.setAttribute('readonly','readonly');
				this.discountBlock.style.backgroundColor = 'darkgray';
				this.discountBlock.className = 'chart-element__discount';
				this.li.append(this.discountBlock);

				this.countBlock = document.createElement('input');
				this.countBlock.className = 'chart-element__count';
				this.li.append(this.countBlock);
				// this.countBlock.addEventListener('keypress', this.eventFunction);

				this.priceBlock = document.createElement('input');
				this.priceBlock.setAttribute('readonly','readonly');
				this.priceBlock.style.backgroundColor = 'darkgray';
				this.priceBlock.className = 'chart-element__price';
				this.li.append(this.priceBlock);
				
				this.load( this.relatedChart );
				return this.li;
			},


		};

		obj.genereteElement();
		obj.countBlock.addEventListener('keyup', (e) => {
			obj.calculate();
			e.target.dispatchEvent(countClickEvent);
		});
		return obj;
	}


	this.createBasket = () => {
		let obj = {
			basket: null,
			elementsHolder: null,
			elements: [],
			price: null,
			findElement: function(chartElement){
				for( let basketElement of this.elements){
					if(basketElement.id == chartElement.id){
						return basketElement ;
					}
				}
				return false;
			},
			addHtmlElement: function(basketElement){
				if( this.elementsHolder != null ){
					this.elementsHolder.prepend( basketElement.getHtmlElement() );
					return true;
				}
				return false;
			},
			addElement: function(chartElement){
				let e = this.findElement(chartElement);
				if( e !== false ){
					e.updateElement(chartElement);
				}else{
					let basketElement = ShopHelper.createBasketElement(chartElement);
					this.elements.push(basketElement);
					this.addHtmlElement(basketElement);
				}
				this.calculate();
			},
			calculate: function(){
				let price = 0;
				for( let element of this.elements){
					price += parseFloat( element.priceBlock.value );
				}
				this.price.innerText = price.toFixed(2) + ' грн';
			},
		};

		obj.basket = document.querySelector('#basket');
		obj.elementsHolder = obj.basket.querySelector('.chart_list');
		obj.price = obj.basket.querySelector('.price__value');

		obj.basket.addEventListener('countClick', (e) =>{
			obj.calculate();
		})
		return obj;
	}
}




/******************************************************************************/
const basket = ShopHelper.createBasket();


document.addEventListener('DOMContentLoaded', (e) => {
	for(let btn of document.querySelectorAll('.stuff__btn')){
 		btn.addEventListener('click',(e) => {
			let chart = ShopHelper.getChartElement( btn );
				basket.addElement(chart);
			
 		});
 	}
});


/*
	let buttons = document.querySelectorAll('.stuff__btn')
	//let myEvent = document.createEvent('Event');

	//or
	let myEvent = new Event('Event', {bubbles: true, cancelable: true} );

	myEvent.__proto__.id = 777
	myEvent.__proto__.data = {data:'some data'}
	myEvent.id = 777
	myEvent.data = {data:'some data'}

	// @var1 String [Event name for dispatching and listeners]
	// @var2 boolean Sets this event to bubbling state (this event will bubble up by DOM tree until it cought)
	// @var3 boolean Sets this event to state in witch it can be canseled
	myEvent.initEvent('myEvent', true, true)

	document.querySelectorAll('.stuff').forEach( (e)=>{
		e.addEventListener('myEvent', (event)=>{
			console.log('i`v cantch an instace of MyEvent');
			console.log(event);
			console.log('Event data ', event.data);
		} );
	})

	buttons[0].dispatchEvent(myEvent);
*/