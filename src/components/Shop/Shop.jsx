import React, { useEffect, useState } from "react";
import {
  addToDb,
  deleteShoppingCart,
  getShoppingCart,
} from "../../utilities/fakedb";
import Cart from "../Cart/Cart";
import Product from "../Product/Product";
import "./Shop.css";
import { Link, useLoaderData } from "react-router-dom";

const Shop = () => {
    // const carts = useLoaderData();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true); 

  const numberOfPages = Math.ceil(count / itemPerPage);
  const pages = [...Array(numberOfPages).keys()];


  useEffect(() => {
    setIsLoading(true); 
    fetch(
      `https://b9-ema-john-pagination-server-start.vercel.app/products?page=${currentPage}&size=${itemPerPage}`
    )
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setIsLoading(false); 
      });
  }, [currentPage, itemPerPage]);


  useEffect(() => {
    fetch("https://b9-ema-john-pagination-server-start.vercel.app/productCount")
      .then((res) => res.json())
      .then((data) => setCount(data.count));
  }, []);

  
  useEffect(() => {
    const storedCart = getShoppingCart();
    const savedCart = [];
    for (const id in storedCart) {
      const addedProduct = products.find((product) => product._id === id);
      if (addedProduct) {
        const quantity = storedCart[id];
        addedProduct.quantity = quantity;
        savedCart.push(addedProduct);
      }
    }
    setCart(savedCart);
  }, [products]); 

  const handleAddToCart = (product) => {
    let newCart = [];
    const exists = cart.find((pd) => pd._id === product._id);
    if (!exists) {
      product.quantity = 1;
      newCart = [...cart, product];
    } else {
      exists.quantity = exists.quantity + 1;
      const remaining = cart.filter((pd) => pd._id !== product._id);
      newCart = [...remaining, exists];
    }
    setCart(newCart);
    addToDb(product._id);
  };

  const handleClearCart = () => {
    setCart([]);
    deleteShoppingCart();
  };

  const handleItemsPerPage = (e) => {
    const number = parseInt(e.target.value);
    setItemPerPage(number);
    setCurrentPage(0);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPae = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="shop-container">
      <div className="products-container">
        {
          isLoading ? <p>Loading...</p> : 
          products.map((product) => (
            <Product
              key={product._id}
              product={product}
              handleAddToCart={handleAddToCart}
            ></Product>
          ))
        }
      </div>
      <div className="cart-container">
        <Cart cart={cart} handleClearCart={handleClearCart}>
          <Link className="proceed-link" to="/orders">
            <button className="btn-proceed">Review Order</button>
          </Link>
        </Cart>
      </div>
      <div className="pagination">
        <p className="currentPage">This is CurrentPage{currentPage}</p>
        <button onClick={handlePrevPage}>Prev</button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={currentPage === page ? "selected" : ""}
          >
            {page}
          </button>
        ))}
        <button onClick={handleNextPae}>Next</button>
        <select name="select" value={itemPerPage} onChange={handleItemsPerPage}>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="40">40</option>
          <option value="50">50</option>
          <option value="60">60</option>
        </select>
      </div>
    </div>
  );
};

export default Shop;