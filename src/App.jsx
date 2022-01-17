import React from 'react';
import List from "./List";
import Alert from "./Alert";

const getLocalStorage = () => {
  let list = localStorage.getItem("namelist");
  if (list) {
    return (list = JSON.parse(localStorage.getItem('namelist')));
  } else {
    return [];
  }
}

function App() {
  const [name, setName] = React.useState('');
  const [namelist, setNameList] = React.useState(getLocalStorage());
  const [nameedit, setNameEdit] = React.useState(false);
  const [nameeditid, setNameEditId] = React.useState(null);
  const [alert, setAlert] = React.useState({show:false, message:'',type:''})
  
  const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      showAlert(true, 'danger', 'please enter value');
    } else if (name && nameedit) {
      setNameList(
        namelist.map((item) => {
          if (item.id === nameeditid) {
            return { ...item, title: name };
          }
          return item;
        })
      );
      setName('');
      setNameEditId(null);
      setNameEdit(false);
      showAlert(true, 'success', 'value changed');
    } else {
      showAlert(true, 'success', 'item added to the list');
      const newItem = { id: new Date().getTime().toString(), title: name };

      setNameList([...namelist, newItem]);
      setName('');
    }
  }

  const editItem = (id) => {
    console.log("namelist", namelist)
    const editedItem = namelist.find((item) => item.id === id);
    setNameEdit(true);
    setNameEditId(id)
    setName(editedItem.name);
  }

  const deleteItem = (id) => {
    showAlert(true, 'danger', 'item removed');
    const deletedItem = namelist.filter((item) => item.id !== id);
    setNameList(deletedItem)
  }

  const clearList = () => {
    showAlert(true, 'danger', 'empty list');
    setNameList([]);
  }

  React.useEffect(() => {
    localStorage.setItem("namelist",JSON.stringify(namelist));
  }, [namelist])

  return (
    <section className='section-center'>
      <form className="grocery-form" onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={namelist}/>}
        <h3>Grocery List</h3>
        <div className="form-control">
          <input type="text" className="grocery" placeholder="eg: carrot" value={name} onChange={(e) => setName(e.target.value)} /> 
          <button type="submit" className="submit-btn">
            {nameedit ? "edit" : "submit"}
          </button>
        </div>
      </form>
      <div className="grocery-container">
        <List items={namelist} editItem={editItem} deleteItem={deleteItem}/>
      </div> 
      <button className="clear-btn" onClick={clearList}>Clear Items</button>
    </section>
  );
}

export default App;