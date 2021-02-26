import React from "react";
import { Layout, Menu } from "antd";
import styled from "styled-components";
import {
  ProfileOutlined,
  CloudServerOutlined,
  CreditCardOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import InvoiceTable from "../components/InvoiceTable";

const { Header, Content, Sider } = Layout;

const StyledHeader = styled(Header)`
  padding-left: 40px;
  background: #fff;
`;

const StyledContent = styled(Content)`
  margin: 24px 16px 0;
`;

const StyledMenu = styled(Menu as any)``;

export default function Dashboard() {
  return (
    <Layout>
      <Sider breakpoint="lg" collapsedWidth="0" theme="light">
        <StyledMenu theme="light" mode="inline" defaultSelectedKeys={["1"]}>
          <StyledMenu.Item key="1" icon={<ProfileOutlined />}>
            Faturalar
          </StyledMenu.Item>
          <StyledMenu.Item key="2" icon={<CreditCardOutlined />}>
            Ödeme Yöntemleri
          </StyledMenu.Item>
          <StyledMenu.Item key="3" icon={<CloudServerOutlined />}>
            Hizmetler
          </StyledMenu.Item>
          <StyledMenu.Item key="4" icon={<SettingOutlined />}>
            Ayarlar
          </StyledMenu.Item>
        </StyledMenu>
      </Sider>
      <Layout>
        <StyledHeader className="site-layout-sub-header-background">
          <h2>Faturalar</h2>
        </StyledHeader>
        <StyledContent>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 1024 }}
          >
            <InvoiceTable />
          </div>
        </StyledContent>
      </Layout>
    </Layout>
  );
}
