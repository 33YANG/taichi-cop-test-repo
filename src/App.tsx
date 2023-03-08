import { useState } from 'react'
import { Avatar, Button, Spin } from 'antd'
import { CodepenCircleOutlined, GithubOutlined } from '@ant-design/icons'
import { LoginWithGithub } from './components/Login'
import { RenderScene } from './components/RenderScene'
import { REACT_APP_GITHUB_REPO_URL, REACT_APP_GITHUB_AUTH_URL } from './utils'
import './assets/app.less'

function App() {
  // github user info
  const [userInfo, setUserInfo] = useState<Types.GithubUserInfo>({
    name: 'Hello World',
  })
  // login loading status
  const [loading, setLoading] = useState<boolean>(false)

  // jump to github user page
  const handleAvatarClick = () => {
    console.log('userInfo', userInfo)
    window.location.href = userInfo?.html_url || ''
  }

  // jump to github repo readme
  const handleDocumentClick = () => {
    window.location.href = REACT_APP_GITHUB_REPO_URL
  }

  // jump to github login page
  const handleLoginClick = () => {
    window.location.href = REACT_APP_GITHUB_AUTH_URL
  }
  return (
    <main>
      <Spin spinning={loading} size="large">
        <header>
          <div className="title">
            <CodepenCircleOutlined style={{ fontSize: '20px' }} />
            <span>3D Editor</span>
          </div>

          <div className="right-info">
            <div className="user-docs" onClick={handleDocumentClick}>
              Documents
            </div>
            {userInfo.id ? (
              <div className="user-info" onClick={handleAvatarClick} title={userInfo.name}>
                <Avatar size={32} src={<img src={userInfo.avatar_url} alt="avatar" />} />
                <span className="name">{userInfo.name}</span>
              </div>
            ) : (
              <div className="login-btn">
                <Button icon={<GithubOutlined />} size="small" onClick={handleLoginClick}>
                  Login
                </Button>
              </div>
            )}
          </div>
        </header>
        <section className="content">
          <RenderScene text={userInfo.name} />
          <LoginWithGithub setUserInfo={setUserInfo} setLoading={setLoading} />
        </section>
      </Spin>
    </main>
  )
}

export default App
