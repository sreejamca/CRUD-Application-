//class Book
class Book{
  constructor(bookname,author,category,bookid){
    this.bookname=bookname;
    this.author=author;
    this.category=category;
    this.id=bookid;
  }
}
//class LibraryService
class LibraryService{
  static url="http://localhost:3000/Books";//Api to get a Book data.
  static getAllBooks(){//function to get all the book data.
    return $.get(this.url);//returns the data 
  }
  static getBook(bookid){//function to get a particular book.
    return $.get(this.url+`/${bookid}`);//Getting a particular book depends on its id from the book data.
  }
  static createBook(book){//adding book.
    
    return $.post(this.url,book)//adding a new book to the exixting data.
  }
  static updateBook(book){//Editing a book details.
    return $.ajax({       
      url:this.url+`/${book.id}`,
      dataType:'json',
      data:JSON.stringify(book),
      contentType:'application/json',
      type:'PUT'
    });//using jquery,calling an ajax method to update the book details.
  }
  static deleteBook(bookid){//a function to delete the book giving its id.
    return $.ajax({
      url:this.url+`/${bookid}`,
      type:'DELETE'
    });//ajax call to delete a book.
  }
}
//class UIManager
class UIManager{
static books;
static getAllBooks(){
LibraryService.getAllBooks().then(books=>this.display(books))//first getting all the details of all the books in the db,
                                                            //then calling the promise which then displaysthe books.
}
static createBook(bookname,author,category,bookid){//create book passing the book fields.
  LibraryService.createBook(new Book(bookname,author,category,bookid))//instanciating the class Book
 .then(()=>{
  return LibraryService.getAllBooks();//calling the promise and getting all book details
 }).then((books)=>this.display(books));//then display the created books.
}
static updateBook(bookname,author,category,bookid){//passing the parameters
  LibraryService.updateBook(new Book(bookname,author,category,bookid))//upadating the book details
 .then(()=>{
  return LibraryService.getAllBooks();//get all the details
 }).then((books)=>this.display(books));//display the books.
}
static deleteBook(bookid){
  LibraryService.deleteBook(bookid)//delete a book giving its id.
  .then(()=>{
    return LibraryService.getAllBooks()
  })
  .then((books)=>this.display(books));//getting the book details and displays it.
}
static display(books){//display the book details.
  this.books=books;//assigning books array property to the collection of books received from the api.
  for(let book of books){
    $('tbody').append(//appending the table data to the table body using jquery.
      $(`
             <tr>
               <td>${book.bookname}</td>
               <td>${book.author}</td>
               <td>${book.category}</td>
               <td>${book.id}</td>
             </tr>
           `)

    )
  }
}
static clearFields()//a function to clear the input fields.
{
  $('#bknameinput').val('');
  $('#authorinput').val('');
  $('#cat').val('');
  $('#bookidinput').val('');
}

static validatedBook(){  //This function validate input fields. 
 let id=$('#bookidinput').val();
if(id=='')
{
  return;
}
let book=new Book();
book.id = id;
let bkName = $('#bknameinput').val();
let authorName = $('#authorinput').val();
if(bkName!=''&&(bkName!=undefined)&&(bkName!=null))
{
  book.bookname = $('#bknameinput').val();
}
else{
  let bookNM = '';
  UIManager.books.forEach(element => {
    if(element.id==id)
    {
      bookNM = element.bookname;
    }
  });
  book.bookname = bookNM;

}
if(authorName!=''&&authorName!=undefined&&authorName!=null)
{
  book.author = $('#authorinput').val();
}
else
{
  let bookAu = '';
  UIManager.books.forEach(element => {
    if(element.id==id)
    {
      bookAu = element.author;
    }
  });
  book.author = bookAu;
}
if($('#cat').val()!='')
{
  let bookCat = $('#cat').val();
  if(bookCat == "choose the category")
  {
    UIManager.books.forEach(element => {
      if(element.id==id)
      {
        bookCat = element.category;
      }
    });
    book.category = bookCat;
  }
  else
  {
    book.category = bookCat;
  }
}
return book;
}
}

$("#crtbtn").on("click",function(){//adding events to the DOM elements.
  let book = UIManager.validatedBook();
  if(book.category == "choose the category"||book.bookname==''||book.author=='')//if any of the input fields is empty,do not allow to create a new book.
  {
    return;
  }

UIManager.createBook(book.bookname,book.author,book.category,book.id);
clearFields();//calling clearfield function to empty the fields.
})

//Delete a book detail:
$('#delbtn').on("click",function(){
    let id=$('#bookidinput').val();
    UIManager.deleteBook(id);
    clearFields();
})

$('#updtbtn').on("click",function(){
  let book = UIManager.validatedBook();
  if(book.category == "choose the category"||book.bookname==''||book.author=='')
  {
    return;
  }
  UIManager.updateBook(book.bookname,book.author,book.category,book.id);
  clearFields();
})

UIManager.getAllBooks();







