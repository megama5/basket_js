// Create the event.
var event = document.createEvent('Event');
event.initEvent('priceChange', true, true);

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
	this.createBasketElement = ( chartElement ) =>{
		
		let obj = {
			relatedChart: null,
			count: 0,
			li: null,
			titleBlock: null,
			discountBlock: null,
			countBlock: null,
			priceBlock: null,
			isExists: function(){
				let e;
				if( this.relatedChart != null && 
					(e = document.querySelector('#chart_list .chart-element[data-id="'+this.relatedChart.id+'"]') )!= null){
					return e;
				}
				return false;
			},
			updateElement: function(){
				let e = this.isExists();
				if( e === false ){ return false; }
				
				this.li = e;
				this.countBlock = e.querySelector('.chart-element__count');
				this.priceBlock = e.querySelector('.chart-element__price');
				this.count += parseInt(this.countBlock.value);
				this.countBlock.value = this.count;
				this.priceBlock.value = this.count * this.relatedChart.calculate() + ' грн';
				return true;
			},
			genereteElement: function(){	
				if( this.relatedChart == null || this.updateElement() === true ){ return false; }

				//basket element
				this.li = document.createElement('li');
				this.li.dataset.id = this.relatedChart.id;
				this.li.className = 'chart-element';

				this.titleBlock = document.createElement('p');
				this.titleBlock.innerText = this.relatedChart.title;
				this.li.append(this.titleBlock);

				this.discountBlock = document.createElement('input');
				this.discountBlock.value = this.relatedChart.discountText;
				this.discountBlock.setAttribute('readonly','readonly');
				this.discountBlock.style.backgroundColor = 'darkgray';
				this.discountBlock.className = 'chart-element__discount';
				this.li.append(this.discountBlock);

				this.countBlock = document.createElement('input');
				this.countBlock.value = 1;
				this.countBlock.className = 'chart-element__count';
				this.li.append(this.countBlock);

				this.priceBlock = document.createElement('input');
				this.priceBlock.value = this.relatedChart.calculate()+' грн';
				this.priceBlock.setAttribute('readonly','readonly');
				this.priceBlock.style.backgroundColor = 'darkgray';
				this.priceBlock.className = 'chart-element__price';
				this.li.append(this.priceBlock);
				
				return this.li;
			},
		};

		obj.relatedChart = chartElement;
		obj.count = 1;

		return obj;
	}


	this.createBasket = () => {
		let obj = {
			basket: null,
			elementsHolder: null,
			elements: [],
			price: null,
			addElement: function(element){
				let li = element.genereteElement();
				if( li !== false ){
					this.elements.push(element);
					this.elementsHolder.prepend(li);				
				}
				this.calculate();
			},
			calculate: function(){
				let price = 0;
				for( let element of this.elements){
					price += parseFloat( element.priceBlock.value );
				}
				this.price.innerText = price + ' грн';
			},
		};

		obj.basket = document.querySelector('#basket');
		obj.elementsHolder = obj.basket.querySelector('.chart_list');
		obj.price = obj.basket.querySelector('.price__value');

		return obj;
	}
}




/******************************************************************************/
const basket = ShopHelper.createBasket();


document.addEventListener('DOMContentLoaded', (e) => {
	for(let btn of document.querySelectorAll('.stuff__btn')){
 		btn.addEventListener('click',(e) => {
			let chart = ShopHelper.getChartElement( btn );
			let element = ShopHelper.createBasketElement(chart);
			basket.addElement(element);
			
 		});
 	}
});
