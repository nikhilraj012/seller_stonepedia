import Select from "react-select";
import { FiUpload } from "react-icons/fi";
import { MdOutlineKeyboardArrowUp, MdOutlineKeyboardArrowDown } from "react-icons/md";

const BlockFields = ({
  block,
  setBlock,
  countryOptions,
  handleFile,
  handleIncrement,
  handleDecrement,
  firstInputRef,
}) => {
  return (
    <div className="">  
          <h2 className="text-xs font-semibold mb-1">Blocks Details</h2>  
          <div  
            id="blockDetailsForm"  
            className="border border-dashed border-[#000000]/20 rounded-lg p-2 md:p-4 space-y-1 md:space-y-2"  
          >  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 w-full">  
              <div className="w-full flex flex-col">  
                <label htmlFor="stoneCategory" className="mb-0.5 text-xs">  
                  Stone Category  
                </label>  
                <div className="rounded-lg p-[1px] transition bg-transparent focus-within:bg-gradient-to-t focus-within:from-[#d6c9ea] focus-within:to-[#871B58]">  
                  <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">  
                    <input  
                      id="stoneCategory"  
                      ref={firstInputRef}  
                      type="text"  
                      placeholder="Marble, Granite ...."  
                      value={block.stoneCategory}  
                      onChange={(e) =>  
                        setBlock({  
                          ...block,  
                          stoneCategory: e.target.value,  
                        })  
                      }  
                      className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full"  
                      name="stoneCategory"  
                    />  
                  </div>  
                </div>  
              </div>  

              <div className="w-full flex flex-col">  
                <label htmlFor="stoneName" className="mb-0.5 text-xs">  
                  Block / Stone Name  
                </label>  
                <div className="rounded-lg p-[1px] transition bg-transparent focus-within:bg-gradient-to-t focus-within:from-[#d6c9ea] focus-within:to-[#871B58]">  
                  <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">  
                    <input  
                      id="stoneName"  
                      type="text"  
                      placeholder="Stonepedia White Marble"  
                      value={block.stoneName}  
                      onChange={(e) =>  
                        setBlock({  
                          ...block,  
                          stoneName: e.target.value,  
                        })  
                      }  
                      className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full"  
                      name="stoneName"  
                    />  
                  </div>  
                </div>  
              </div>  
            </div>  

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 w-full my-3">  
              <div className="min-w-0">  
                <label className="mb-0.5 text-xs">Origin</label>  
                <Select  
                  options={countryOptions}  
                  value={block.origin}  
                  onChange={(value) => {  
                    setBlock((prev) => ({  
                      ...prev,  
                      origin: value,  
                    }));  
                  }}  
                  placeholder="Origin"  
                  name="origin"  
                  className="text-xs"  
                />  
              </div>  

              <div className="w-full flex flex-col">  
                <label htmlFor="portName" className="mb-0.5 text-xs">  
                  Nearby Port Name  
                </label>  
                <div className="rounded-lg p-[1px] transition bg-transparent focus-within:bg-gradient-to-t focus-within:from-[#d6c9ea] focus-within:to-[#871B58]">  
                  <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">  
                    <input  
                      id="portName"  
                      type="text"  
                      placeholder="Nearby Port"  
                      value={block.portName}  
                      onChange={(e) =>  
                        setBlock({  
                          ...block,  
                          portName: e.target.value,  
                        })  
                      }  
                      className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full"  
                      name="portName"  
                    />  
                  </div>  
                </div>  
              </div>  
            </div>  

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 w-full my-3">  
              <div className="w-full flex flex-col">  
                <label htmlFor="units" className="mb-0.5 text-xs">  
                  Units  
                </label>  
                <Select  
                  options={[  
                    { label: "MM", value: "mm" },  
                    { label: "CM", value: "cm" },  
                    { label: "Inche", value: "inches" },  
                    { label: "Feet", value: "ft" },  
                    { label: "Meter", value: "meter" },  
                  ]}  
                  value={block.units}  
                  onChange={(label) => {  
                    setBlock((prev) => ({  
                      ...prev,  
                      units: label,  
                    }));  
                  }}  
                  placeholder="Units"  
                  name="units"  
                  className="text-xs"  
                />  
              </div>  

              <div className="w-full flex flex-col">  
                <label htmlFor="height" className="mb-0.5 text-xs">  
                  Height  
                </label>  
                <div className="rounded-lg p-[1px] transition bg-transparent focus-within:bg-gradient-to-t focus-within:from-[#d6c9ea] focus-within:to-[#871B58]">  
                  <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">  
                    <input  
                      id="height"  
                      type="number"  
                      placeholder="Height"  
                      value={block.height}  
                      onChange={(e) =>  
                        setBlock({  
                          ...block,  
                          height: e.target.value,  
                        })  
                      }  
                      className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full"  
                      name="height"  
                    />  
                  </div>  
                </div>  
              </div>  

              <div className="w-full flex flex-col">  
                <label htmlFor="width" className="mb-0.5 text-xs">  
                  Width  
                </label>  
                <div className="rounded-lg p-[1px] transition bg-transparent focus-within:bg-gradient-to-t focus-within:from-[#d6c9ea] focus-within:to-[#871B58]">  
                  <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">  
                    <input  
                      id="width"  
                      type="number"  
                      placeholder="Width"  
                      value={block.width}  
                      onChange={(e) =>  
                        setBlock({  
                          ...block,  
                          width: e.target.value,  
                        })  
                      }  
                      className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full"  
                      name="width"  
                    />  
                  </div>  
                </div>  
              </div>  

              <div className="w-full flex flex-col">  
                <label htmlFor="length" className="mb-0.5 text-xs">  
                  Length  
                </label>  
                <div className="rounded-lg p-[1px] transition bg-transparent focus-within:bg-gradient-to-t focus-within:from-[#d6c9ea] focus-within:to-[#871B58]">  
                  <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">  
                    <input  
                      id="length"  
                      type="number"  
                      placeholder="Length"  
                      value={block.length}  
                      onChange={(e) =>  
                        setBlock({  
                          ...block,  
                          length: e.target.value,  
                        })  
                      }  
                      className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full"  
                      name="length"  
                    />  
                  </div>  
                </div>  
              </div>  
            </div>  

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 w-full my-3">  
              <div className="w-full flex flex-col">  
                <label  
                  htmlFor="supplyCapacity"  
                  className="mb-0.5 text-xs text-nowrap"  
                >  
                  Supply Capacity  
                </label>  
                <div className="rounded-lg p-[1px] transition bg-transparent focus-within:bg-gradient-to-t focus-within:from-[#d6c9ea] focus-within:to-[#871B58]">  
                  <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">  
                    <input  
                      id="supplyCapacity"  
                      type="number"  
                      placeholder="Enter in ton"  
                      value={block.supplyCapacity}  
                      onChange={(e) =>  
                        setBlock({  
                          ...block,  
                          supplyCapacity: e.target.value,  
                        })  
                      }  
                      className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full"  
                      name="supplyCapacity"  
                    />  
                  </div>  
                </div>  
              </div>  

              <div className="w-full flex flex-col">  
                <label  
                  htmlFor="quantityAvailable"  
                  className="mb-0.5 text-xs text-nowrap"  
                >  
                  Available Quantity  
                </label>  
                <div className="rounded-lg p-[1px] transition bg-transparent focus-within:bg-gradient-to-t focus-within:from-[#d6c9ea] focus-within:to-[#871B58]">  
                  <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">  
                    <input  
                      id="quantityAvailable"  
                      type="number"  
                      placeholder="Enter in ton"  
                      value={block.quantity}  
                      onChange={(e) =>  
                        setBlock({  
                          ...block,  
                          quantity: e.target.value,  
                        })  
                      }  
                      className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full"  
                      name="quantity"  
                    />  
                  </div>  
                </div>  
              </div>  

              <div className="w-full flex flex-col">  
                <label htmlFor="minimumOrder" className="mb-0.5 text-xs">  
                  Minimum Order  
                </label>  
                <div className="rounded-lg p-[1px] transition bg-transparent focus-within:bg-gradient-to-t focus-within:from-[#d6c9ea] focus-within:to-[#871B58]">  
                  <div className="flex items-center justify-between gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">  
                    <input  
                      id="minimumOrder"  
                      type="number"  
                      placeholder="Enter in ton"  
                      value={block.minimumOrder}  
                      onChange={(e) =>  
                        setBlock({  
                          ...block,  
                          minimumOrder: e.target.value,  
                        })  
                      }  
                      className="flex-1 w-full bg-transparent outline-none border-0 p-3 text-xs"  
                      name="minimumOrder"  
                    />  
                    <div className="flex flex-col mr-2">  
                      <button  
                        type="button"  
                        onClick={handleIncrement}  
                        className="cursor-pointer hover:text-primary focus:outline-none"  
                      >  
                        <MdOutlineKeyboardArrowUp size={16} />  
                      </button>  
                      <button  
                        type="button"  
                        onClick={handleDecrement}  
                        className="cursor-pointer hover:text-primary focus:outline-none"  
                      >  
                        <MdOutlineKeyboardArrowDown size={16} />  
                      </button>  
                    </div>  
                  </div>  
                </div>  
              </div>  
            </div>  

            <div className="w-full my-3 lg:grid grid-cols-2 xl:grid-cols-3 gap-3">  
              <div className="">  
                <label htmlFor="symbolA" className="mb-0.5 text-xs">  
                  Grade-A Price (Ton)  
                </label>  
                <div className="flex gap-2 rounded-lg bg-white border border-[#D7D7D7] p-1">  
                  <Select  
                    options={[  
                      { label: "₹", value: "rupee" },  
                      { label: "$", value: "dollar" },  
                    ]}  
                    value={block.symbolA}  
                    onChange={(value) => {  
                      setBlock((prev) => ({  
                        ...prev,  
                        symbolA: value,  
                      }));  
                    }}  
                    placeholder="price"  
                    name="symbolA"  
                    className="text-xs lg:w-[80%]"  
                  />  
                  <div>  
                    <input  
                      type="number"  
                      className="w-full outline-none h-full text-sm"  
                      placeholder="Enter Price"  
                      value={block.priceA}  
                      onChange={(e) => {  
                        setBlock((prev) => ({  
                          ...prev,  
                          priceA: e.target.value,  
                        }));  
                      }}  
                    />  
                  </div>  
                </div>  
              </div>  

              <div className="">  
                <label htmlFor="symbolB" className="mb-0.5 text-xs">  
                  Grade-B Price (Ton)  
                </label>  
                <div className="flex gap-2 rounded-lg bg-white border border-[#D7D7D7] p-1">  
                  <Select  
                    options={[  
                      { label: "₹", value: "rupee" },  
                      { label: "$", value: "dollar" },  
                    ]}  
                    value={block.symbolB}  
                    onChange={(value) => {  
                      setBlock((prev) => ({  
                        ...prev,  
                        symbolB: value,  
                      }));  
                    }}  
                    placeholder="price"  
                    name="symbolB"  
                    className="text-xs lg:w-[80%]"  
                  />  
                  <div>  
                    <input  
                      type="number"  
                      className="w-full outline-none h-full text-sm"  
                      placeholder="Enter Price"  
                      value={block.priceB}  
                      onChange={(e) => {  
                        setBlock((prev) => ({  
                          ...prev,  
                          priceB: e.target.value,  
                        }));  
                      }}  
                    />  
                  </div>  
                </div>  
              </div>  

              <div className="">  
                <label htmlFor="symbolC" className="mb-0.5 text-xs">  
                  Grade-C Price (Ton)  
                </label>  
                <div className="flex gap-2 rounded-lg bg-white border border-[#D7D7D7] p-1">  
                  <Select  
                    options={[  
                      { label: "₹", value: "rupee" },  
                      { label: "$", value: "dollar" },  
                    ]}  
                    value={block.symbolC}  
                    onChange={(value) => {  
                      setBlock((prev) => ({  
                        ...prev,  
                        symbolC: value,  
                      }));  
                    }}  
                    placeholder="price"  
                    name="symbolC"  
                    className="text-xs lg:w-[80%]"  
                  />  
                  <div>  
                    <input  
                      type="number"  
                      className="w-full outline-none h-full text-sm"  
                      placeholder="Enter Price"  
                      value={block.priceC}  
                      onChange={(e) => {  
                        setBlock((prev) => ({  
                          ...prev,  
                          priceC: e.target.value,  
                        }));  
                      }}  
                    />  
                  </div>  
                </div>  
              </div>  
            </div>  

            {/* <div className="md:my-5">  
              <label className="block mb-1 text-xs font-medium">  
                Upload Block Images/Videos  
              </label>  
              <div className="flex gap-4 flex-col md:flex-row">  
             
                <label className="flex flex-col items-center justify-center w-full md:w-1/2 border-1 border-dashed border-primary rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition">  
                  <FiUpload size={20} className="mb-2 text-gray-900" />  
                  <span className="text-xs font-medium">Upload Videos</span>  
                  <span className="text-[8px] text-gray-500">  
                    Upload videos of block (max 50MB each, max 10 files)  
                  </span>  
                  <span className="mt-2 text-[8px] text-gray-600 font-semibold">  
                    {block.videos.length > 0  
                      ? `Uploaded ${block.videos.length}`  
                      : "Browse"}  
                  </span>  
                  <input  
                    type="file"  
                    accept="video/*"  
                    className="hidden"  
                    onChange={(e) => handleFile(e, "videos")}  
                    multiple  
                  />  
                </label>  

               
                <label className="flex flex-col items-center justify-center w-full md:w-1/2 border-1 border-dashed border-primary bg-primary/10 rounded-lg p-6 text-center cursor-pointer hover:bg-primary/10 transition">  
                  <FiUpload size={20} className="mb-2 text-gray-900" />  
                  <span className="text-xs font-medium">Upload Images</span>  
                  <span className="text-[8px] text-gray-500">  
                    JPEG, PNG formats up to 20MB (max 20 files)  
                  </span>  
                  <span className="mt-2 text-[8px] text-gray-600 font-semibold">  
                    {block.images.length > 0  
                      ? `Uploaded ${block.images.length}`  
                      : "Browse"}  
                  </span>  
                  <input  
                    type="file"  
                    accept="image/*"  
                    className="hidden"  
                    onChange={(e) => handleFile(e, "images")}  
                    multiple  
                  />  
                </label>  
              </div>  
            </div>   */}

            <div className="mt-5">  
              <label className="block mb-1 text-xs font-medium">  
                Upload Block Certificate{" "}  
                <span className="text-[#6D6D6D]">(Approved By NABL)</span>  
              </label>  
              <label className="flex flex-col items-center justify-center w-full border-1 border-dashed border-primary rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition">  
                <FiUpload size={20} className="mb-2 text-gray-900" />  
                <span className="text-xs font-medium">  
                  Upload Certificate  
                </span>  
                <span className="mt-2 text-[8px] text-gray-600 font-semibold">  
                  {block.documents.length > 0  
                    ? `${block.documents[0].name}`  
                    : "Browse"}  
                </span>  
                <input  
                  type="file"  
                  accept="application/pdf"  
                  className="hidden"  
                  onChange={(e) => handleFile(e, "documents")}  
                />  
              </label>  
            </div>  

            <div className="my-3">  
              <label  
                htmlFor="description"  
                className="mb-0.5 text-xs font-semibold"  
              >  
                Description  
              </label>  
              <textarea  
                id="description"  
                placeholder="Tell me about block"  
                rows={4}  
                value={block.description}  
                onChange={(e) =>  
                  setBlock({ ...block, description: e.target.value })  
                }  
                className="w-full border border-gray-300 rounded-md p-2 text-xs outline-none"  
                name="description"  
              ></textarea>  
            </div>  

            {/* <div className="flex justify-end">  
              <button  
                type="button"  
               onClick={onSubmit}
                className="bg-[#871B58] px-4 py-2 md:px-8 lg:px-10 xl:px-14 rounded-md text-white text-xs cursor-pointer"  
              >  
                {buttonLabel}
              </button>  
            </div>   */}
          </div>  
        </div>  
     
  );
};

export default BlockFields;