window.onload = function(){
  //let lastElement = document.querySelector('main').scrollTo(0,300);
  //lastElement.scrollTo(0,300);
  let lastElement = document.querySelector('main').lastElementChild;
  let lastPos = lastElement.getBoundingClientRect().y;
  document.querySelector('main').scrollTo(0,lastPos);
};