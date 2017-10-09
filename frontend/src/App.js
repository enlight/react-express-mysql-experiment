import React, { Component } from 'react';
import Form from 'react-jsonschema-form';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './App.css';

const uiSchema = {
  reference: {
    "ui:placeholder": "Short description"
  }
};

class App extends Component {
  constructor(props) {
    super(props);
    this._submit = this._submit.bind(this);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">react-jsonschema-form sample</h1>
        </header>
        <Form schema={this.props.orderSchema} uiSchema={uiSchema} onSubmit={this._submit} />
      </div>
    );
  }

  async _submit(data) {
    const response = await fetch('/api/orders/new', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data.formData)
    });
    if (response.ok) {
      const payload = await response.json();
      if (payload.validationErrors) {
        console.error(payload.validationErrors);
      } else {
        console.log(`Added order ${payload.id}`);
      }
    } else {
      throw new Error(`Server error ${response.status}`);
    }
  }
}

export default App;
