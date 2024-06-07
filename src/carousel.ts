//State manager: Takes cares of managing and storing our image array indexes and calls a function once the index changes
function useState(initialIndex: number): [() => number, (newIndex: number) => void, (listener: (value: number) => void) => void] { //Typying what the function returns and gets
    //Initializing and typing 
    let index = initialIndex; 
    const listeners: ((index: number) => void)[] = []; 

    //Gets the current index stored
    const getIndex = () => index;

    //Set the new assigned index and calls each listener function with the updated index
    const setIndex = (newIndex: number) => {
        index = newIndex; 
        listeners.forEach(listener => listener(index));
    };

    //Adds a listerner for a fonction that will be called once we set a new index 
    const addListener = (listener: (value: number) => void) => {
        listeners.push(listener);
    };

    return [getIndex, setIndex, addListener];
}

//Carousel class: Serves the purpose of setting our Carousel to the HTML element in the DOM chosen to hold our carousel(in this case it's #carousel)
export class Carousel {
    //Typing
    el: HTMLElement;
    btnEl: HTMLElement;
    items: string[];
    gap: number;
    size: number;
    getCurrentIndex: () => number;
    setCurrentIndex: (newIndex: number) => void;
    addListenerToIndex: (listener: (index: number) => void) => void;

    //The constructor that builds our carousel with the settings given(if gap or size not given, we set a default value)
    constructor(el: HTMLElement, btnEl: HTMLElement, items: string[], gap: number = 0, size: number = 1) {
        this.el = el;
        this.btnEl = btnEl;
        this.items = items;
        this.gap = gap;
        this.size = size;

        [this.getCurrentIndex, this.setCurrentIndex, this.addListenerToIndex] = useState(0); //Initializes our useState function
    
        this.buildCarousel();

        this.bindButtons();

        this.addListenerToIndex(() => this.moveCarousel()); //Adds moveCarousel to the listeners

    }
    
    //Dynamically adds our carousel's HTML content to the DOM, taking into account the settings given
    buildCarousel(): void {
        const wrapperSize = 100 / this.size; //Calculates the percentage of the carousel-container width's, depending of the size setting, for the width of each carousel-img-wrapper
        const marginLeft = this.gap / 2 // Calculates a margin to "center" our image elements, taking into account our gap
        
        //A loop that creates the HTML content for each of our images in our array, the carousel-img-wrapper and our img tag
        const imagesDiv = this.items.map(itemSrc => `
            <div style="padding-left:${this.gap}px; flex: 0 0 ${wrapperSize}%" class="carousel-img-wrapper">
                <img src="${itemSrc}" alt="" class="carousel-img">
            </div>
        `).join('');

        this.el.innerHTML = `
            <div class="carousel-viewport">
                <div style="margin-left:-${marginLeft}px;" class="carousel-container">
                    ${imagesDiv}
                </div>
            </div>
        `

        //Adds buttons(prev and next) to #button-container
        this.btnEl.innerHTML = `
            <div class="button-prev">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="20" height="20" focusable="false">
                    <path d="m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z"></path>
                </svg>
            </div>
            <div class="button-next">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="20" height="20" focusable="false">
                    <path d="m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z"></path>
                </svg>
            </div>
        `
    }

    //Binds the buttons to eventListeners to register user's click and execute a function
    bindButtons(): void{
        const prevButton = this.btnEl.querySelector('.button-prev') as HTMLElement;
        const nextButton = this.btnEl.querySelector('.button-next') as HTMLElement;

        nextButton.addEventListener('click', () => this.next());
        prevButton.addEventListener('click', () => this.prev());
    }

    //Our functions to change states, setting new index values in our useState
    //With Math.min and Math.max we clamp the value of our index so to always have the right quantity of images, chosen with "size", and not "overshoot" it
    next(): void{
        const newIndex = Math.min(this.getCurrentIndex() + 1, this.items.length - this.size);//We add +1 to getCurrentIndex as it starts at 0 and the .length starts at 1
        this.setCurrentIndex(newIndex);
    }
    prev(): void{
        const newIndex = Math.max(this.getCurrentIndex() - 1, 0);
        this.setCurrentIndex(newIndex);
    }

    //Fuction called everytime our index changes, it translates our carousel-container in the x-axis
    moveCarousel(): void{
        const wrapperSize = 100 / this.size; //Calculates the percentage of the carousel-container width's, depending of the size setting, for the width of each carousel-img-wrapper
        const container = this.el.querySelector('.carousel-container') as HTMLElement;
        const move = -(this.getCurrentIndex() * wrapperSize); //We mutiply wrapperSize, which is essentialy the width of each carousel-img-wrapper, by the current index
        
        container.style.transform = `translateX(${move}%)`//We translate the carousel-container to the right position
    }
}