import React from 'react'
import 'antd/dist/antd.css';

import { Form, Icon, Input, Button } from 'antd';
const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    let {handleSubmit, handleBlur, userError, pwdError, userValid, pwdValid, userValue, pwdValue, handleChange}=this.props;
    return (
      <Form className="login-form">
        <FormItem>
            <Input value={userValue} name="username" prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" 
              onChange={(e)=>handleChange( "user", e.target.value)}
              onBlur={(e)=>handleBlur(e.target.value)}
            />
        {!userValid && <span className="error">{userError}</span>}
        </FormItem>
        <FormItem>
            <Input value={pwdValue} name="password" prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" 
              onChange={(e)=>handleChange( "pwd", e.target.value)}
            />
        {!pwdValid && <span className="error">{pwdError}</span>}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" className="login-form-button" onClick={handleSubmit}>
            提交
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default WrappedNormalLoginForm;