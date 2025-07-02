using my.bookshop as mb from '../db/schema';

service CatalogService {
    
    entity Books as projection on mb.Books;
    entity Authors @readonly as projection on mb.Authors;
    entity Orders as projection on mb.Orders;

}