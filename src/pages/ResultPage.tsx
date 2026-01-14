import { useState, useEffect, useMemo } from "react";

import { useProducts } from "../hooks/useProducts";
import { Navigate, useNavigate } from "react-router-dom";
import { saveProductsIntoDB } from "../api/products";

export default function ResultsPage() {
  
    
    
    // const [brands, setBrands] = useState<string[]>([])   simply use the variable instead of state
    const [selectedBrands, setSelectedBrands] = useState<string>("All")
    const [selectedCategory, setSelectedCategory] = useState<string>("All")
    const [maxPrice, setmaxPrice] = useState<string>("")
    const [query, setQuery] = useState("")
    const {products, loading, error} = useProducts()

    const navigate = useNavigate();

    console.log("products outside the useEffect", products)

    const brands_names = useMemo(() => {
        return Array.from(new Set(products.map(p => p.brand).filter(Boolean)))
    }, [products]) 

    const category_names = useMemo(() => {
        return Array.from(
            new Set(products.map((p) => p.category).filter(Boolean)));
    }, [products]);
    
    console.log("brands", brands_names)

    // !!!!!!!!!!!!!!! Never use such patterns in filters

    // const filtered_products = products.filter((p) => 
    // {
    //     if (selectedBrands == "All") {
    //         return true
    //     } 
    //     if (selectedBrands != "All" && selectedCategory != "All") {
    //         return p.brand == selectedBrands && p.category == selectedCategory
    //     } 
    //     if(selectedCategory == "All"){
    //         return true
    //     }
    // }
    // )

    // §§§§§§§§§§§§ Better and safer approach

    const filtered_products = useMemo(() => {
        const max = maxPrice.trim() === "" ? null : Number(maxPrice);
        const maxIsValid = max != null && Number.isFinite(max);
        console.log("query", query, typeof(query))


        return products.filter((p) => {
            const brandOK = selectedBrands === "All" || p.brand === selectedBrands;

            const categoryOK = selectedCategory === "All" || p.category === selectedCategory;

            const priceOK =
            maxPrice.trim() === ""
                ? true
                : maxIsValid
                ? p.price <= (max as number)
                : true;

            
            const q = (query ?? "").trim().toLowerCase()    //Use query if it is NOT 'null' and NOT 'undefined'
            const brand = (p.brand ?? "").toLowerCase()     // 💥 crashes if brand is undefined in case of brand is not mentioned in the product coming from api
            const name = (p.title ?? "").toLowerCase()
            
            const queryOK = q ==="" || brand.includes(q) || name.includes(q)

            return brandOK && categoryOK && priceOK && queryOK;
        });
        }, [products, selectedBrands, selectedCategory, maxPrice, query]);
    
    if (loading) return <div className="container">Loading products…</div>;
    if (error) return <div className="container">Error: {error}</div>;

    async function handleSaveButton() {
        const result = await saveProductsIntoDB();
        console.log(result);
    }

    return (
    <main className="container">
      <div className="results_header">
        <h1 className="results_title"> Results </h1>

        <div className="search_box">
            <button className="search_button" onClick={handleSaveButton}>
                save products
            </button>
            <input type="text" className="search_input" 
                    placeholder="Search Products Here..." value={query} onChange={(e) => setQuery(e.target.value)}
            />
            <button className="search_button">
                Search
            </button>
        
        </div>


      </div>

      <div className="results_layout">
        <aside className="filter_section">
            <h3 className="filters_title"> Filters </h3>

            <label  className="field"> 
                <span className="field_label"> Category</span>
                <select id="" className="field_input" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option> All </option>
                    {category_names.map((category)=> 
                    
                    <option > {category} </option>
                    ) }
                </select>
            </label>

            <label  className="field"> 
                <span className="field_label"> Brands</span>
                
                
                <select id="" className="field_input" value={selectedBrands} onChange={(e) => setSelectedBrands(e.target.value)}>
                    <option value="All">All</option>
                    {brands_names.map(b => <option key={b} value={b}>{b}</option>)}
                    
                </select>
            </label>

            <label  className="field"> 
                <span className="field_label"> Max Price</span>
                <input type="text" className="field_input" value={maxPrice} onChange={(e) => setmaxPrice(e.target.value)}/>
            </label>
        </aside>

        <section className="result_section">
            {filtered_products.map((p) => 
                <div className="card">
                    <img className="card_img" src={p.thumbnail} alt={p.title} />
                    <div className="card_title">{p.title}</div>
                    <div className="card_meta">{p.brand}</div>
                    <div className="card_price">{p.price}</div>
                    
                    <div className="card_buttons_wrap">
                        <button className="card_button" type="button" onClick={() =>navigate(`/product/${p.id}`, {state: { product: p }})}> View </button>
                        <button className="card_button" type="button" onClick={() =>navigate(`/product/${p.id}`, {state: { product: p }})}> Compare </button>

                    </div>
                    
                </div>
            )}
            

            
        </section>
      
      </div>
    </main>
  );
}
