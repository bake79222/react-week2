import { useState } from 'react';
import axios from "axios";
import "./assets/style.css";
import 'bootstrap/dist/css/bootstrap.min.css'; // 必須要有這一行

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;


function App() {

  // 表單資料狀態
  const [formData, setFormData] = useState({
    username:"geno-chen@gmail.com",
    password:"666666"
  })
  //登入狀態管理
  const [isAuth,setIsAuth] = useState(false);

  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // console.log(name,value)
    setFormData((preData) => ({
      ...preData,
      [name]:value
    }))
  }
  const getProducts = async ()=>{
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products`);
      setProducts(response.data.products);
    } catch (error) {
      console.log(error.response) 
    }
  }


  const onSubmit = async (e) =>{
    try {
      e.preventDefault();
      const response = await axios.post(`${API_BASE}/admin/signin`,formData)
      // console.log(response.data);
      const { token, expired} = response.data;
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
      axios.defaults.headers.common['Authorization'] = token;
      getProducts();
      setIsAuth(true);


    } catch (error) {
      setIsAuth(flase);
      console.log(error.response)
    }
  }
  const  checkLogin  =async () =>{
    try {
      const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];

      axios.defaults.headers.common['Authorization'] = token;

      const response = await axios.post(`${API_BASE}/api/user/check`);
      console.log(response.data);
    } catch (error) {
      console.log(error.response?.data.response);
    }
  }

  return (
    <>
    {
      !isAuth ?(      
      <div className="container login ">
        
        <form className="form-floating form-signin bg-info"  onSubmit={(e) => onSubmit(e)}>
          <h1 className='mt-auto text-white'>請輸入帳號密碼</h1>
          <div className="form-floating mb-3 ">
            <input type="email" 
            className="form-control text-primary" 
            name="username" 
            placeholder="name@example.com" 
            value={formData.username}
            onChange={(e) => handleInputChange(e)}
            />
            <label htmlFor="username" className='text-gray'>Email address</label>
          </div>
          <div className="form-floating">
            <input type="password" 
            className="form-control text-primary" 
            name="password" 
            placeholder="Password" 
            value={formData.password}
            onChange={(e) => handleInputChange(e)}
            />
            <label htmlFor="password" className='text-gray'>Password</label>
          </div>
          <button type='submit' className='btn btn-primary w-100 mt-4' >登入</button>
        </form>
      </div>):(
        <div className='container'>
          <div className="row">
              <div className="col-md-6">
                  <button
                    className="btn btn-warning mb-5"
                    type="button"
                    onClick={() =>checkLogin()}
                  >
                    確認是否登入
                  </button>
                  <h2>產品列表</h2>
                  <table className="table table-striped ">
                      <thead>
                          <tr>
                          <th scope="col" className='bg-success text-white border '>產品名稱</th>
                          <th scope="col" className='bg-success text-white border '>原價</th>
                          <th scope="col" className='bg-success text-white border'>售價</th>
                          <th scope="col" className='bg-success text-white border'>是否啟用</th>
                          <th scope="col" className='bg-success text-white border'>查看細節</th>
                          </tr>
                      </thead>
                      <tbody>
                          {
                              products.map((product) => (
                              <tr key={product.id}>    
                                  <th scope="row">{product.title}</th>
                                      <td>{product.origin_price}</td>
                                      <td>{product.price}</td>
                                      <td>{product.is_enabled ? "啟用" : "未啟用"}</td>
                                      <td>
                                          <button type="button" className="btn btn-primary" onClick={() => setTempProduct(product)}>查看</button>
                                      </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
              <div className="col-md-6">
                  <h2>產品明細</h2>
                  {
                      tempProduct ? (
                      <div className="card" >
                          <img src={tempProduct.imageUrl} className="card-img-top" alt="主圖" style={{ height: "300px" }}/>
                          <div className="card-body">
                              <h5 className="card-title">{tempProduct.title}</h5>
                              <p className="card-text">商品描述：{tempProduct.description}</p>
                              <p className="card-text">商品內容：{tempProduct.content}</p>
                              <div className="d-flex">
                                  <del className="text-secondary">{tempProduct.origin_price}</del>元/
                                  {tempProduct.price}元
                              </div>
                              <h5 className="card-title">更多圖片</h5>
                              <div className="overflow-x-auto w-100">
                                <div className="d-flex flex-nowrap">
                                    {
                                        tempProduct.imagesUrl.map((url,index) =>(
                                          <img key = {index}
                                                src={url} 
                                                alt="主圖" 
                                                style={{ height: "100px",marginRight:'5px' ,flexShrink: 0}}
                                            /> 
                                        ))
                                    }
                                </div>
                              </div>


                          </div>
                      </div>
                      ):(<p>請選擇產品</p>)}

              </div>
          </div>

        </div>
      )
    }



    </>
  )
}

export default App
