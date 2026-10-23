import { useEffect, useMemo, useState } from 'react';
import {
  Activity, Bell, Check, ChevronDown, CircleHelp, Filter,
  LayoutDashboard, MousePointer2, Settings, ShieldAlert,
  ShieldCheck, X, Menu, CalendarDays, FileDown, Info,
  ChevronLeft, ChevronRight
} from 'lucide-react';

const PAGE_SIZE = 10;

// Exact 350-row ClickGuard Demo dataset supplied by the user (CSV).
const CLICKGUARD_DEMO_EVENTS = [{"click_id":"CG-0001","ip_address":"199.140.125.58","timestamp":"2026-10-16 18:54:00","device":"Tablet","click_duration":0.52,"scroll_depth":2.3,"mouse_movement":16.1,"keystrokes_detected":0,"ad_position":"Bottom","click_frequency":9,"time_since_last_click":0.17,"device_ip_reputation":0.13,"VPN_usage":1,"proxy_usage":1,"browser":"Safari","operating_system":"Linux","is_fraudulent":1,"classification":"Fraud","risk_score":83.3,"demo_record":1},{"click_id":"CG-0002","ip_address":"217.3.81.179","timestamp":"2026-10-16 15:39:00","device":"Desktop","click_duration":17.79,"scroll_depth":45.8,"mouse_movement":96.5,"keystrokes_detected":1,"ad_position":"Top","click_frequency":1,"time_since_last_click":70.25,"device_ip_reputation":0.71,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":21.3,"demo_record":1},{"click_id":"CG-0003","ip_address":"85.185.98.181","timestamp":"2026-10-16 14:27:00","device":"Mobile","click_duration":0.33,"scroll_depth":14.5,"mouse_movement":17.7,"keystrokes_detected":0,"ad_position":"Top","click_frequency":20,"time_since_last_click":0.77,"device_ip_reputation":0.27,"VPN_usage":1,"proxy_usage":1,"browser":"Safari","operating_system":"iOS","is_fraudulent":1,"classification":"Fraud","risk_score":90.9,"demo_record":1},{"click_id":"CG-0004","ip_address":"165.87.125.42","timestamp":"2026-10-16 19:39:00","device":"Tablet","click_duration":19.18,"scroll_depth":45.2,"mouse_movement":74.4,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":7,"time_since_last_click":138.99,"device_ip_reputation":0.57,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":4.4,"demo_record":1},{"click_id":"CG-0005","ip_address":"90.108.255.102","timestamp":"2026-10-16 17:40:00","device":"Desktop","click_duration":33.96,"scroll_depth":73.2,"mouse_movement":39.7,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":6,"time_since_last_click":106.47,"device_ip_reputation":0.95,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":19.8,"demo_record":1},{"click_id":"CG-0006","ip_address":"49.81.216.153","timestamp":"2026-10-16 08:48:00","device":"Mobile","click_duration":5.22,"scroll_depth":53.6,"mouse_movement":61.4,"keystrokes_detected":0,"ad_position":"Top","click_frequency":6,"time_since_last_click":159.61,"device_ip_reputation":0.88,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":7.7,"demo_record":1},{"click_id":"CG-0007","ip_address":"194.134.91.130","timestamp":"2026-10-16 08:03:00","device":"Mobile","click_duration":34.94,"scroll_depth":90.3,"mouse_movement":87.0,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":3,"time_since_last_click":137.96,"device_ip_reputation":0.79,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":13.7,"demo_record":1},{"click_id":"CG-0008","ip_address":"102.157.122.15","timestamp":"2026-10-16 08:19:00","device":"Desktop","click_duration":0.79,"scroll_depth":12.5,"mouse_movement":1.5,"keystrokes_detected":0,"ad_position":"Top","click_frequency":32,"time_since_last_click":1.38,"device_ip_reputation":0.09,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"iOS","is_fraudulent":1,"classification":"Fraud","risk_score":86.2,"demo_record":1},{"click_id":"CG-0009","ip_address":"64.102.159.103","timestamp":"2026-10-16 18:21:00","device":"Mobile","click_duration":37.83,"scroll_depth":73.7,"mouse_movement":91.8,"keystrokes_detected":1,"ad_position":"Top","click_frequency":2,"time_since_last_click":42.77,"device_ip_reputation":0.7,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":4.6,"demo_record":1},{"click_id":"CG-0010","ip_address":"27.16.169.19","timestamp":"2026-10-16 18:46:00","device":"Mobile","click_duration":1.51,"scroll_depth":6.1,"mouse_movement":3.9,"keystrokes_detected":0,"ad_position":"Bottom","click_frequency":15,"time_since_last_click":1.98,"device_ip_reputation":0.33,"VPN_usage":1,"proxy_usage":1,"browser":"Edge","operating_system":"iOS","is_fraudulent":1,"classification":"Fraud","risk_score":83.4,"demo_record":1},{"click_id":"CG-0011","ip_address":"23.50.31.104","timestamp":"2026-10-16 15:58:00","device":"Desktop","click_duration":28.49,"scroll_depth":85.0,"mouse_movement":38.4,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":2,"time_since_last_click":77.67,"device_ip_reputation":0.67,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":5.5,"demo_record":1},{"click_id":"CG-0012","ip_address":"13.47.121.43","timestamp":"2026-10-16 19:07:00","device":"Mobile","click_duration":17.22,"scroll_depth":61.1,"mouse_movement":92.0,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":1,"time_since_last_click":177.4,"device_ip_reputation":0.67,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":25.8,"demo_record":1},{"click_id":"CG-0013","ip_address":"85.111.29.149","timestamp":"2026-10-16 16:18:00","device":"Mobile","click_duration":2.1,"scroll_depth":1.3,"mouse_movement":1.0,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":24,"time_since_last_click":2.31,"device_ip_reputation":0.24,"VPN_usage":1,"proxy_usage":0,"browser":"Safari","operating_system":"Windows","is_fraudulent":1,"classification":"Fraud","risk_score":88.1,"demo_record":1},{"click_id":"CG-0014","ip_address":"113.61.126.149","timestamp":"2026-10-16 19:31:00","device":"Mobile","click_duration":23.81,"scroll_depth":71.5,"mouse_movement":71.9,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":2,"time_since_last_click":121.54,"device_ip_reputation":0.69,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":13.4,"demo_record":1},{"click_id":"CG-0015","ip_address":"169.51.37.138","timestamp":"2026-10-16 09:14:00","device":"Mobile","click_duration":0.71,"scroll_depth":5.8,"mouse_movement":15.9,"keystrokes_detected":0,"ad_position":"Feed","click_frequency":17,"time_since_last_click":0.48,"device_ip_reputation":0.34,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"Linux","is_fraudulent":1,"classification":"Fraud","risk_score":80.1,"demo_record":1},{"click_id":"CG-0016","ip_address":"44.135.59.228","timestamp":"2026-10-16 19:19:00","device":"Mobile","click_duration":0.43,"scroll_depth":12.2,"mouse_movement":5.1,"keystrokes_detected":0,"ad_position":"Feed","click_frequency":14,"time_since_last_click":1.75,"device_ip_reputation":0.35,"VPN_usage":1,"proxy_usage":1,"browser":"Chrome","operating_system":"Windows","is_fraudulent":1,"classification":"Fraud","risk_score":89.1,"demo_record":1},{"click_id":"CG-0017","ip_address":"95.66.134.42","timestamp":"2026-10-16 12:43:00","device":"Mobile","click_duration":2.11,"scroll_depth":12.1,"mouse_movement":10.1,"keystrokes_detected":0,"ad_position":"Top","click_frequency":36,"time_since_last_click":1.76,"device_ip_reputation":0.1,"VPN_usage":1,"proxy_usage":1,"browser":"Safari","operating_system":"macOS","is_fraudulent":1,"classification":"Fraud","risk_score":75.4,"demo_record":1},{"click_id":"CG-0018","ip_address":"213.20.183.54","timestamp":"2026-10-16 13:15:00","device":"Mobile","click_duration":26.87,"scroll_depth":75.0,"mouse_movement":82.0,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":2,"time_since_last_click":156.04,"device_ip_reputation":0.98,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":28.5,"demo_record":1},{"click_id":"CG-0019","ip_address":"115.127.136.41","timestamp":"2026-10-16 13:40:00","device":"Desktop","click_duration":30.56,"scroll_depth":33.1,"mouse_movement":88.4,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":7,"time_since_last_click":165.57,"device_ip_reputation":0.7,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":25.8,"demo_record":1},{"click_id":"CG-0020","ip_address":"27.142.179.165","timestamp":"2026-10-16 14:48:00","device":"Tablet","click_duration":20.83,"scroll_depth":76.0,"mouse_movement":45.2,"keystrokes_detected":0,"ad_position":"Top","click_frequency":3,"time_since_last_click":34.61,"device_ip_reputation":0.97,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":28.2,"demo_record":1},{"click_id":"CG-0021","ip_address":"140.59.197.231","timestamp":"2026-10-16 13:21:00","device":"Tablet","click_duration":23.18,"scroll_depth":44.1,"mouse_movement":53.8,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":4,"time_since_last_click":15.39,"device_ip_reputation":0.84,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":20.3,"demo_record":1},{"click_id":"CG-0022","ip_address":"113.151.65.50","timestamp":"2026-10-16 19:22:00","device":"Tablet","click_duration":17.72,"scroll_depth":95.5,"mouse_movement":79.3,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":4,"time_since_last_click":99.98,"device_ip_reputation":0.55,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":17.9,"demo_record":1},{"click_id":"CG-0023","ip_address":"131.86.43.73","timestamp":"2026-10-16 19:31:00","device":"Mobile","click_duration":1.52,"scroll_depth":13.9,"mouse_movement":1.7,"keystrokes_detected":0,"ad_position":"Feed","click_frequency":15,"time_since_last_click":2.04,"device_ip_reputation":0.1,"VPN_usage":1,"proxy_usage":0,"browser":"Chrome","operating_system":"macOS","is_fraudulent":1,"classification":"Fraud","risk_score":83.2,"demo_record":1},{"click_id":"CG-0024","ip_address":"193.196.253.103","timestamp":"2026-10-16 18:44:00","device":"Desktop","click_duration":11.54,"scroll_depth":74.2,"mouse_movement":91.2,"keystrokes_detected":0,"ad_position":"Bottom","click_frequency":2,"time_since_last_click":34.13,"device_ip_reputation":0.97,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":18.4,"demo_record":1},{"click_id":"CG-0025","ip_address":"153.162.226.157","timestamp":"2026-10-16 15:55:00","device":"Mobile","click_duration":31.53,"scroll_depth":91.9,"mouse_movement":86.1,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":6,"time_since_last_click":155.48,"device_ip_reputation":0.75,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":19.4,"demo_record":1},{"click_id":"CG-0026","ip_address":"29.146.120.70","timestamp":"2026-10-16 12:04:00","device":"Desktop","click_duration":14.75,"scroll_depth":92.0,"mouse_movement":29.3,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":6,"time_since_last_click":30.05,"device_ip_reputation":0.64,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":4.2,"demo_record":1},{"click_id":"CG-0027","ip_address":"207.10.194.123","timestamp":"2026-10-16 15:10:00","device":"Mobile","click_duration":3.21,"scroll_depth":51.4,"mouse_movement":88.0,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":4,"time_since_last_click":41.84,"device_ip_reputation":0.74,"VPN_usage":1,"proxy_usage":0,"browser":"Edge","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":32.3,"demo_record":1},{"click_id":"CG-0028","ip_address":"146.13.201.152","timestamp":"2026-10-16 10:10:00","device":"Tablet","click_duration":22.75,"scroll_depth":27.0,"mouse_movement":53.1,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":1,"time_since_last_click":49.05,"device_ip_reputation":0.69,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":29.1,"demo_record":1},{"click_id":"CG-0029","ip_address":"30.240.9.192","timestamp":"2026-10-16 15:11:00","device":"Mobile","click_duration":21.88,"scroll_depth":100.0,"mouse_movement":36.4,"keystrokes_detected":0,"ad_position":"Top","click_frequency":7,"time_since_last_click":8.49,"device_ip_reputation":0.66,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":19.0,"demo_record":1},{"click_id":"CG-0030","ip_address":"65.238.131.197","timestamp":"2026-10-16 09:57:00","device":"Tablet","click_duration":15.91,"scroll_depth":70.4,"mouse_movement":76.9,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":1,"time_since_last_click":105.43,"device_ip_reputation":0.96,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":35.9,"demo_record":1},{"click_id":"CG-0031","ip_address":"186.124.52.179","timestamp":"2026-10-16 11:23:00","device":"Tablet","click_duration":2.2,"scroll_depth":18.7,"mouse_movement":14.5,"keystrokes_detected":1,"ad_position":"Top","click_frequency":19,"time_since_last_click":1.38,"device_ip_reputation":0.28,"VPN_usage":1,"proxy_usage":0,"browser":"Chrome","operating_system":"macOS","is_fraudulent":1,"classification":"Fraud","risk_score":94.2,"demo_record":1},{"click_id":"CG-0032","ip_address":"102.235.78.112","timestamp":"2026-10-16 09:48:00","device":"Tablet","click_duration":9.16,"scroll_depth":64.1,"mouse_movement":40.1,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":4,"time_since_last_click":149.16,"device_ip_reputation":0.81,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":33.7,"demo_record":1},{"click_id":"CG-0033","ip_address":"155.194.172.8","timestamp":"2026-10-16 12:09:00","device":"Mobile","click_duration":20.3,"scroll_depth":49.4,"mouse_movement":35.4,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":3,"time_since_last_click":158.82,"device_ip_reputation":0.86,"VPN_usage":0,"proxy_usage":1,"browser":"Safari","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":10.7,"demo_record":1},{"click_id":"CG-0034","ip_address":"204.123.243.166","timestamp":"2026-10-16 14:56:00","device":"Desktop","click_duration":27.91,"scroll_depth":58.6,"mouse_movement":25.6,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":6,"time_since_last_click":46.07,"device_ip_reputation":0.84,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":37.9,"demo_record":1},{"click_id":"CG-0035","ip_address":"189.232.138.79","timestamp":"2026-10-16 17:23:00","device":"Desktop","click_duration":11.8,"scroll_depth":34.0,"mouse_movement":43.9,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":2,"time_since_last_click":133.73,"device_ip_reputation":0.67,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":32.0,"demo_record":1},{"click_id":"CG-0036","ip_address":"55.154.7.182","timestamp":"2026-10-16 13:03:00","device":"Desktop","click_duration":1.57,"scroll_depth":6.0,"mouse_movement":10.0,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":28,"time_since_last_click":2.18,"device_ip_reputation":0.22,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"macOS","is_fraudulent":1,"classification":"Fraud","risk_score":83.9,"demo_record":1},{"click_id":"CG-0037","ip_address":"74.244.58.211","timestamp":"2026-10-16 11:08:00","device":"Tablet","click_duration":5.29,"scroll_depth":61.9,"mouse_movement":69.6,"keystrokes_detected":0,"ad_position":"Sidebar","click_frequency":2,"time_since_last_click":146.57,"device_ip_reputation":0.97,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":23.5,"demo_record":1},{"click_id":"CG-0038","ip_address":"143.194.230.233","timestamp":"2026-10-16 18:33:00","device":"Mobile","click_duration":1.32,"scroll_depth":18.9,"mouse_movement":5.5,"keystrokes_detected":1,"ad_position":"Top","click_frequency":27,"time_since_last_click":2.4,"device_ip_reputation":0.08,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"Windows","is_fraudulent":1,"classification":"Fraud","risk_score":76.2,"demo_record":1},{"click_id":"CG-0039","ip_address":"50.1.209.116","timestamp":"2026-10-16 10:57:00","device":"Desktop","click_duration":27.13,"scroll_depth":60.2,"mouse_movement":37.0,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":1,"time_since_last_click":124.67,"device_ip_reputation":0.96,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":6.1,"demo_record":1},{"click_id":"CG-0040","ip_address":"78.72.36.16","timestamp":"2026-10-16 11:50:00","device":"Tablet","click_duration":8.81,"scroll_depth":48.1,"mouse_movement":85.6,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":1,"time_since_last_click":85.96,"device_ip_reputation":0.68,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":4.9,"demo_record":1},{"click_id":"CG-0041","ip_address":"198.165.128.7","timestamp":"2026-10-16 08:40:00","device":"Tablet","click_duration":6.2,"scroll_depth":97.1,"mouse_movement":66.1,"keystrokes_detected":0,"ad_position":"Feed","click_frequency":5,"time_since_last_click":10.12,"device_ip_reputation":0.88,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":37.9,"demo_record":1},{"click_id":"CG-0042","ip_address":"135.46.240.90","timestamp":"2026-10-16 15:26:00","device":"Desktop","click_duration":17.29,"scroll_depth":49.1,"mouse_movement":88.3,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":6,"time_since_last_click":90.7,"device_ip_reputation":0.84,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":5.2,"demo_record":1},{"click_id":"CG-0043","ip_address":"207.206.0.169","timestamp":"2026-10-16 12:18:00","device":"Desktop","click_duration":33.43,"scroll_depth":59.6,"mouse_movement":33.4,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":6,"time_since_last_click":81.24,"device_ip_reputation":0.57,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":33.7,"demo_record":1},{"click_id":"CG-0044","ip_address":"171.122.81.80","timestamp":"2026-10-16 16:16:00","device":"Desktop","click_duration":1.61,"scroll_depth":12.1,"mouse_movement":4.0,"keystrokes_detected":0,"ad_position":"Bottom","click_frequency":11,"time_since_last_click":1.65,"device_ip_reputation":0.1,"VPN_usage":0,"proxy_usage":1,"browser":"Firefox","operating_system":"macOS","is_fraudulent":1,"classification":"Fraud","risk_score":94.5,"demo_record":1},{"click_id":"CG-0045","ip_address":"151.74.196.49","timestamp":"2026-10-16 16:03:00","device":"Desktop","click_duration":35.27,"scroll_depth":63.1,"mouse_movement":88.9,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":3,"time_since_last_click":168.36,"device_ip_reputation":0.77,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":22.9,"demo_record":1},{"click_id":"CG-0046","ip_address":"48.228.247.89","timestamp":"2026-10-16 19:15:00","device":"Mobile","click_duration":14.64,"scroll_depth":82.2,"mouse_movement":55.3,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":6,"time_since_last_click":45.27,"device_ip_reputation":0.72,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":27.4,"demo_record":1},{"click_id":"CG-0047","ip_address":"179.77.253.247","timestamp":"2026-10-16 14:30:00","device":"Tablet","click_duration":4.3,"scroll_depth":62.7,"mouse_movement":45.2,"keystrokes_detected":0,"ad_position":"Bottom","click_frequency":1,"time_since_last_click":96.09,"device_ip_reputation":0.75,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":18.9,"demo_record":1},{"click_id":"CG-0048","ip_address":"187.203.41.219","timestamp":"2026-10-16 12:31:00","device":"Tablet","click_duration":14.5,"scroll_depth":75.6,"mouse_movement":49.2,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":7,"time_since_last_click":98.76,"device_ip_reputation":0.82,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":28.9,"demo_record":1},{"click_id":"CG-0049","ip_address":"204.51.227.43","timestamp":"2026-10-16 15:24:00","device":"Desktop","click_duration":27.29,"scroll_depth":92.8,"mouse_movement":44.6,"keystrokes_detected":0,"ad_position":"Feed","click_frequency":3,"time_since_last_click":69.35,"device_ip_reputation":0.61,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":8.3,"demo_record":1},{"click_id":"CG-0050","ip_address":"168.123.254.234","timestamp":"2026-10-16 18:24:00","device":"Tablet","click_duration":23.41,"scroll_depth":42.4,"mouse_movement":38.8,"keystrokes_detected":1,"ad_position":"Top","click_frequency":7,"time_since_last_click":85.35,"device_ip_reputation":0.68,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":12.8,"demo_record":1},{"click_id":"CG-0051","ip_address":"126.154.101.99","timestamp":"2026-10-16 15:14:00","device":"Mobile","click_duration":32.87,"scroll_depth":33.0,"mouse_movement":64.9,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":1,"time_since_last_click":176.1,"device_ip_reputation":0.84,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":28.8,"demo_record":1},{"click_id":"CG-0052","ip_address":"68.180.112.163","timestamp":"2026-10-16 12:53:00","device":"Tablet","click_duration":9.65,"scroll_depth":43.8,"mouse_movement":80.9,"keystrokes_detected":1,"ad_position":"Top","click_frequency":6,"time_since_last_click":117.4,"device_ip_reputation":0.69,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":34.7,"demo_record":1},{"click_id":"CG-0053","ip_address":"54.102.67.202","timestamp":"2026-10-16 13:34:00","device":"Tablet","click_duration":21.88,"scroll_depth":97.9,"mouse_movement":59.1,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":3,"time_since_last_click":164.79,"device_ip_reputation":0.97,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":18.9,"demo_record":1},{"click_id":"CG-0054","ip_address":"67.203.187.24","timestamp":"2026-10-16 09:17:00","device":"Tablet","click_duration":2.25,"scroll_depth":0.3,"mouse_movement":2.2,"keystrokes_detected":0,"ad_position":"Feed","click_frequency":26,"time_since_last_click":1.01,"device_ip_reputation":0.27,"VPN_usage":1,"proxy_usage":0,"browser":"Edge","operating_system":"Windows","is_fraudulent":1,"classification":"Fraud","risk_score":88.7,"demo_record":1},{"click_id":"CG-0055","ip_address":"166.113.32.163","timestamp":"2026-10-16 17:34:00","device":"Mobile","click_duration":31.83,"scroll_depth":93.2,"mouse_movement":71.2,"keystrokes_detected":0,"ad_position":"Sidebar","click_frequency":1,"time_since_last_click":170.49,"device_ip_reputation":0.68,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":18.3,"demo_record":1},{"click_id":"CG-0056","ip_address":"188.214.79.227","timestamp":"2026-10-16 19:26:00","device":"Mobile","click_duration":17.52,"scroll_depth":32.4,"mouse_movement":68.5,"keystrokes_detected":1,"ad_position":"Top","click_frequency":6,"time_since_last_click":68.58,"device_ip_reputation":0.75,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":21.6,"demo_record":1},{"click_id":"CG-0057","ip_address":"111.141.97.248","timestamp":"2026-10-16 19:00:00","device":"Mobile","click_duration":7.28,"scroll_depth":88.6,"mouse_movement":25.5,"keystrokes_detected":1,"ad_position":"Top","click_frequency":1,"time_since_last_click":142.26,"device_ip_reputation":0.66,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":9.5,"demo_record":1},{"click_id":"CG-0058","ip_address":"69.168.75.202","timestamp":"2026-10-16 11:41:00","device":"Desktop","click_duration":34.52,"scroll_depth":25.2,"mouse_movement":99.0,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":1,"time_since_last_click":120.01,"device_ip_reputation":0.56,"VPN_usage":1,"proxy_usage":0,"browser":"Safari","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":13.7,"demo_record":1},{"click_id":"CG-0059","ip_address":"42.215.58.191","timestamp":"2026-10-16 10:58:00","device":"Mobile","click_duration":5.22,"scroll_depth":58.6,"mouse_movement":60.1,"keystrokes_detected":0,"ad_position":"Bottom","click_frequency":5,"time_since_last_click":42.21,"device_ip_reputation":0.82,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":25.2,"demo_record":1},{"click_id":"CG-0060","ip_address":"132.205.218.176","timestamp":"2026-10-16 08:31:00","device":"Mobile","click_duration":0.44,"scroll_depth":15.7,"mouse_movement":1.3,"keystrokes_detected":0,"ad_position":"Feed","click_frequency":27,"time_since_last_click":0.46,"device_ip_reputation":0.09,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"macOS","is_fraudulent":1,"classification":"Fraud","risk_score":98.9,"demo_record":1},{"click_id":"CG-0061","ip_address":"139.220.50.204","timestamp":"2026-10-16 17:03:00","device":"Tablet","click_duration":27.56,"scroll_depth":89.0,"mouse_movement":90.0,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":4,"time_since_last_click":160.19,"device_ip_reputation":0.73,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":17.4,"demo_record":1},{"click_id":"CG-0062","ip_address":"49.242.34.24","timestamp":"2026-10-16 19:21:00","device":"Desktop","click_duration":32.11,"scroll_depth":32.0,"mouse_movement":79.1,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":5,"time_since_last_click":13.62,"device_ip_reputation":0.97,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":33.4,"demo_record":1},{"click_id":"CG-0063","ip_address":"194.26.147.154","timestamp":"2026-10-16 15:13:00","device":"Tablet","click_duration":13.94,"scroll_depth":32.8,"mouse_movement":35.4,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":7,"time_since_last_click":22.15,"device_ip_reputation":0.92,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":32.4,"demo_record":1},{"click_id":"CG-0064","ip_address":"174.13.136.8","timestamp":"2026-10-16 18:36:00","device":"Mobile","click_duration":9.31,"scroll_depth":77.7,"mouse_movement":93.6,"keystrokes_detected":1,"ad_position":"Top","click_frequency":2,"time_since_last_click":156.97,"device_ip_reputation":0.8,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":28.9,"demo_record":1},{"click_id":"CG-0065","ip_address":"126.174.80.95","timestamp":"2026-10-16 11:40:00","device":"Tablet","click_duration":13.91,"scroll_depth":49.3,"mouse_movement":66.9,"keystrokes_detected":0,"ad_position":"Sidebar","click_frequency":2,"time_since_last_click":136.54,"device_ip_reputation":0.57,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":23.9,"demo_record":1},{"click_id":"CG-0066","ip_address":"203.58.176.111","timestamp":"2026-10-16 15:04:00","device":"Tablet","click_duration":6.88,"scroll_depth":75.9,"mouse_movement":57.9,"keystrokes_detected":1,"ad_position":"Top","click_frequency":2,"time_since_last_click":72.96,"device_ip_reputation":0.81,"VPN_usage":1,"proxy_usage":0,"browser":"Safari","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":29.5,"demo_record":1},{"click_id":"CG-0067","ip_address":"11.254.220.45","timestamp":"2026-10-16 12:56:00","device":"Desktop","click_duration":7.52,"scroll_depth":64.9,"mouse_movement":59.0,"keystrokes_detected":1,"ad_position":"Top","click_frequency":4,"time_since_last_click":155.53,"device_ip_reputation":0.57,"VPN_usage":1,"proxy_usage":0,"browser":"Firefox","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":17.5,"demo_record":1},{"click_id":"CG-0068","ip_address":"116.148.58.104","timestamp":"2026-10-16 14:54:00","device":"Tablet","click_duration":3.73,"scroll_depth":49.4,"mouse_movement":55.7,"keystrokes_detected":1,"ad_position":"Top","click_frequency":4,"time_since_last_click":152.47,"device_ip_reputation":0.66,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":28.8,"demo_record":1},{"click_id":"CG-0069","ip_address":"53.39.58.136","timestamp":"2026-10-16 11:46:00","device":"Mobile","click_duration":20.85,"scroll_depth":92.9,"mouse_movement":46.8,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":1,"time_since_last_click":28.92,"device_ip_reputation":0.64,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":36.2,"demo_record":1},{"click_id":"CG-0070","ip_address":"203.229.165.222","timestamp":"2026-10-16 18:43:00","device":"Mobile","click_duration":36.98,"scroll_depth":48.7,"mouse_movement":23.6,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":7,"time_since_last_click":51.62,"device_ip_reputation":0.57,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":4.0,"demo_record":1},{"click_id":"CG-0071","ip_address":"33.196.236.149","timestamp":"2026-10-16 12:53:00","device":"Desktop","click_duration":1.62,"scroll_depth":17.4,"mouse_movement":8.1,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":18,"time_since_last_click":1.55,"device_ip_reputation":0.23,"VPN_usage":0,"proxy_usage":1,"browser":"Firefox","operating_system":"Windows","is_fraudulent":1,"classification":"Fraud","risk_score":85.6,"demo_record":1},{"click_id":"CG-0072","ip_address":"191.224.224.135","timestamp":"2026-10-16 10:56:00","device":"Mobile","click_duration":1.54,"scroll_depth":3.5,"mouse_movement":16.5,"keystrokes_detected":0,"ad_position":"Bottom","click_frequency":32,"time_since_last_click":0.91,"device_ip_reputation":0.26,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"iOS","is_fraudulent":1,"classification":"Fraud","risk_score":74.6,"demo_record":1},{"click_id":"CG-0073","ip_address":"74.76.170.21","timestamp":"2026-10-16 19:34:00","device":"Mobile","click_duration":23.4,"scroll_depth":35.6,"mouse_movement":43.4,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":5,"time_since_last_click":128.46,"device_ip_reputation":0.59,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":26.1,"demo_record":1},{"click_id":"CG-0074","ip_address":"33.216.185.5","timestamp":"2026-10-16 19:41:00","device":"Desktop","click_duration":15.69,"scroll_depth":38.5,"mouse_movement":46.0,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":2,"time_since_last_click":180.0,"device_ip_reputation":0.62,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":33.6,"demo_record":1},{"click_id":"CG-0075","ip_address":"106.78.83.47","timestamp":"2026-10-16 18:32:00","device":"Desktop","click_duration":2.35,"scroll_depth":17.0,"mouse_movement":13.0,"keystrokes_detected":0,"ad_position":"Bottom","click_frequency":19,"time_since_last_click":1.72,"device_ip_reputation":0.13,"VPN_usage":1,"proxy_usage":1,"browser":"Edge","operating_system":"Android","is_fraudulent":1,"classification":"Fraud","risk_score":86.4,"demo_record":1},{"click_id":"CG-0076","ip_address":"210.240.99.95","timestamp":"2026-10-16 13:16:00","device":"Mobile","click_duration":26.74,"scroll_depth":67.8,"mouse_movement":55.9,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":5,"time_since_last_click":96.36,"device_ip_reputation":0.98,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":3.9,"demo_record":1},{"click_id":"CG-0077","ip_address":"151.52.63.73","timestamp":"2026-10-16 16:12:00","device":"Mobile","click_duration":5.94,"scroll_depth":37.0,"mouse_movement":92.2,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":1,"time_since_last_click":170.52,"device_ip_reputation":0.65,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":3.9,"demo_record":1},{"click_id":"CG-0078","ip_address":"108.41.191.58","timestamp":"2026-10-16 16:34:00","device":"Tablet","click_duration":3.99,"scroll_depth":94.8,"mouse_movement":71.3,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":1,"time_since_last_click":53.78,"device_ip_reputation":0.92,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":24.2,"demo_record":1},{"click_id":"CG-0079","ip_address":"65.76.216.29","timestamp":"2026-10-16 09:21:00","device":"Desktop","click_duration":2.21,"scroll_depth":5.2,"mouse_movement":0.9,"keystrokes_detected":0,"ad_position":"Bottom","click_frequency":10,"time_since_last_click":0.37,"device_ip_reputation":0.37,"VPN_usage":1,"proxy_usage":1,"browser":"Safari","operating_system":"Android","is_fraudulent":1,"classification":"Fraud","risk_score":79.9,"demo_record":1},{"click_id":"CG-0080","ip_address":"71.213.95.171","timestamp":"2026-10-16 08:01:00","device":"Mobile","click_duration":26.39,"scroll_depth":64.3,"mouse_movement":23.5,"keystrokes_detected":0,"ad_position":"Bottom","click_frequency":7,"time_since_last_click":86.21,"device_ip_reputation":0.83,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":30.4,"demo_record":1},{"click_id":"CG-0081","ip_address":"178.53.170.35","timestamp":"2026-10-16 13:53:00","device":"Tablet","click_duration":4.55,"scroll_depth":66.0,"mouse_movement":32.4,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":6,"time_since_last_click":35.26,"device_ip_reputation":0.61,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":9.3,"demo_record":1},{"click_id":"CG-0082","ip_address":"90.158.203.254","timestamp":"2026-10-16 11:24:00","device":"Desktop","click_duration":31.54,"scroll_depth":60.5,"mouse_movement":79.8,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":3,"time_since_last_click":155.6,"device_ip_reputation":0.57,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":34.0,"demo_record":1},{"click_id":"CG-0083","ip_address":"108.173.95.128","timestamp":"2026-10-16 15:30:00","device":"Tablet","click_duration":27.22,"scroll_depth":52.6,"mouse_movement":39.9,"keystrokes_detected":0,"ad_position":"Bottom","click_frequency":1,"time_since_last_click":79.22,"device_ip_reputation":0.99,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":13.8,"demo_record":1},{"click_id":"CG-0084","ip_address":"164.218.85.177","timestamp":"2026-10-16 13:02:00","device":"Tablet","click_duration":18.54,"scroll_depth":58.5,"mouse_movement":89.3,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":3,"time_since_last_click":116.19,"device_ip_reputation":0.9,"VPN_usage":1,"proxy_usage":0,"browser":"Edge","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":20.5,"demo_record":1},{"click_id":"CG-0085","ip_address":"17.73.224.9","timestamp":"2026-10-16 19:35:00","device":"Tablet","click_duration":0.48,"scroll_depth":5.2,"mouse_movement":6.6,"keystrokes_detected":0,"ad_position":"Top","click_frequency":27,"time_since_last_click":0.47,"device_ip_reputation":0.21,"VPN_usage":1,"proxy_usage":1,"browser":"Chrome","operating_system":"Linux","is_fraudulent":1,"classification":"Fraud","risk_score":75.7,"demo_record":1},{"click_id":"CG-0086","ip_address":"176.142.127.246","timestamp":"2026-10-16 14:15:00","device":"Mobile","click_duration":6.97,"scroll_depth":80.2,"mouse_movement":60.5,"keystrokes_detected":0,"ad_position":"Feed","click_frequency":7,"time_since_last_click":49.07,"device_ip_reputation":0.75,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":6.4,"demo_record":1},{"click_id":"CG-0087","ip_address":"192.227.44.208","timestamp":"2026-10-16 09:15:00","device":"Mobile","click_duration":26.87,"scroll_depth":88.4,"mouse_movement":72.8,"keystrokes_detected":0,"ad_position":"Feed","click_frequency":3,"time_since_last_click":153.69,"device_ip_reputation":0.86,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":10.1,"demo_record":1},{"click_id":"CG-0088","ip_address":"70.252.13.93","timestamp":"2026-10-16 11:25:00","device":"Tablet","click_duration":22.39,"scroll_depth":52.7,"mouse_movement":28.6,"keystrokes_detected":0,"ad_position":"Top","click_frequency":3,"time_since_last_click":73.47,"device_ip_reputation":0.87,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":4.7,"demo_record":1},{"click_id":"CG-0089","ip_address":"125.238.176.33","timestamp":"2026-10-16 13:24:00","device":"Tablet","click_duration":33.73,"scroll_depth":83.5,"mouse_movement":66.2,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":5,"time_since_last_click":164.2,"device_ip_reputation":0.57,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":13.6,"demo_record":1},{"click_id":"CG-0090","ip_address":"142.145.40.65","timestamp":"2026-10-16 11:50:00","device":"Mobile","click_duration":9.87,"scroll_depth":96.7,"mouse_movement":28.3,"keystrokes_detected":1,"ad_position":"Top","click_frequency":5,"time_since_last_click":116.45,"device_ip_reputation":0.81,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":3.5,"demo_record":1},{"click_id":"CG-0091","ip_address":"174.135.107.197","timestamp":"2026-10-16 08:29:00","device":"Desktop","click_duration":1.67,"scroll_depth":13.6,"mouse_movement":9.0,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":28,"time_since_last_click":2.4,"device_ip_reputation":0.22,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"macOS","is_fraudulent":1,"classification":"Fraud","risk_score":74.0,"demo_record":1},{"click_id":"CG-0092","ip_address":"116.247.237.53","timestamp":"2026-10-16 09:01:00","device":"Tablet","click_duration":1.05,"scroll_depth":3.2,"mouse_movement":5.7,"keystrokes_detected":0,"ad_position":"Bottom","click_frequency":12,"time_since_last_click":1.93,"device_ip_reputation":0.23,"VPN_usage":1,"proxy_usage":1,"browser":"Chrome","operating_system":"iOS","is_fraudulent":1,"classification":"Fraud","risk_score":84.1,"demo_record":1},{"click_id":"CG-0093","ip_address":"84.196.214.64","timestamp":"2026-10-16 10:24:00","device":"Mobile","click_duration":2.7,"scroll_depth":19.9,"mouse_movement":16.8,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":14,"time_since_last_click":1.93,"device_ip_reputation":0.22,"VPN_usage":1,"proxy_usage":0,"browser":"Firefox","operating_system":"macOS","is_fraudulent":1,"classification":"Fraud","risk_score":72.6,"demo_record":1},{"click_id":"CG-0094","ip_address":"71.110.180.13","timestamp":"2026-10-16 14:42:00","device":"Tablet","click_duration":4.77,"scroll_depth":62.1,"mouse_movement":73.1,"keystrokes_detected":1,"ad_position":"Top","click_frequency":7,"time_since_last_click":22.03,"device_ip_reputation":0.61,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":3.6,"demo_record":1},{"click_id":"CG-0095","ip_address":"59.185.147.19","timestamp":"2026-10-16 08:52:00","device":"Tablet","click_duration":16.52,"scroll_depth":58.8,"mouse_movement":40.9,"keystrokes_detected":0,"ad_position":"Sidebar","click_frequency":1,"time_since_last_click":72.72,"device_ip_reputation":0.9,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":23.7,"demo_record":1},{"click_id":"CG-0096","ip_address":"21.19.70.183","timestamp":"2026-10-16 14:51:00","device":"Mobile","click_duration":14.66,"scroll_depth":60.5,"mouse_movement":30.2,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":5,"time_since_last_click":59.38,"device_ip_reputation":0.72,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":31.8,"demo_record":1},{"click_id":"CG-0097","ip_address":"154.153.243.209","timestamp":"2026-10-16 17:05:00","device":"Desktop","click_duration":3.58,"scroll_depth":49.8,"mouse_movement":98.4,"keystrokes_detected":1,"ad_position":"Top","click_frequency":5,"time_since_last_click":87.0,"device_ip_reputation":0.98,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":23.0,"demo_record":1},{"click_id":"CG-0098","ip_address":"194.194.75.211","timestamp":"2026-10-16 10:54:00","device":"Tablet","click_duration":26.83,"scroll_depth":27.4,"mouse_movement":27.0,"keystrokes_detected":0,"ad_position":"Bottom","click_frequency":3,"time_since_last_click":77.12,"device_ip_reputation":0.73,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":27.4,"demo_record":1},{"click_id":"CG-0099","ip_address":"93.244.192.81","timestamp":"2026-10-16 16:51:00","device":"Tablet","click_duration":2.69,"scroll_depth":10.1,"mouse_movement":6.2,"keystrokes_detected":0,"ad_position":"Feed","click_frequency":27,"time_since_last_click":1.26,"device_ip_reputation":0.39,"VPN_usage":1,"proxy_usage":1,"browser":"Firefox","operating_system":"iOS","is_fraudulent":1,"classification":"Fraud","risk_score":91.0,"demo_record":1},{"click_id":"CG-0100","ip_address":"91.245.178.144","timestamp":"2026-10-16 19:46:00","device":"Mobile","click_duration":35.68,"scroll_depth":84.7,"mouse_movement":41.6,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":7,"time_since_last_click":64.09,"device_ip_reputation":0.89,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":35.3,"demo_record":1},{"click_id":"CG-0101","ip_address":"132.109.103.212","timestamp":"2026-10-16 19:11:00","device":"Tablet","click_duration":21.85,"scroll_depth":95.0,"mouse_movement":40.3,"keystrokes_detected":0,"ad_position":"Sidebar","click_frequency":2,"time_since_last_click":11.99,"device_ip_reputation":0.95,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":13.9,"demo_record":1},{"click_id":"CG-0102","ip_address":"207.70.2.247","timestamp":"2026-10-16 16:03:00","device":"Mobile","click_duration":1.61,"scroll_depth":20.4,"mouse_movement":11.8,"keystrokes_detected":0,"ad_position":"Bottom","click_frequency":28,"time_since_last_click":0.58,"device_ip_reputation":0.39,"VPN_usage":1,"proxy_usage":0,"browser":"Chrome","operating_system":"Linux","is_fraudulent":1,"classification":"Fraud","risk_score":78.3,"demo_record":1},{"click_id":"CG-0103","ip_address":"54.213.90.240","timestamp":"2026-10-16 08:38:00","device":"Mobile","click_duration":35.19,"scroll_depth":99.8,"mouse_movement":82.6,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":1,"time_since_last_click":4.64,"device_ip_reputation":0.8,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":37.6,"demo_record":1},{"click_id":"CG-0104","ip_address":"44.239.139.50","timestamp":"2026-10-16 17:16:00","device":"Tablet","click_duration":31.31,"scroll_depth":49.8,"mouse_movement":55.6,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":1,"time_since_last_click":133.38,"device_ip_reputation":0.9,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":32.8,"demo_record":1},{"click_id":"CG-0105","ip_address":"141.167.44.103","timestamp":"2026-10-16 14:55:00","device":"Desktop","click_duration":26.42,"scroll_depth":38.9,"mouse_movement":57.2,"keystrokes_detected":1,"ad_position":"Top","click_frequency":3,"time_since_last_click":70.89,"device_ip_reputation":0.75,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":25.5,"demo_record":1},{"click_id":"CG-0106","ip_address":"180.60.238.79","timestamp":"2026-10-16 19:49:00","device":"Tablet","click_duration":8.59,"scroll_depth":76.5,"mouse_movement":81.1,"keystrokes_detected":0,"ad_position":"Feed","click_frequency":3,"time_since_last_click":111.79,"device_ip_reputation":0.65,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":27.3,"demo_record":1},{"click_id":"CG-0107","ip_address":"215.111.126.175","timestamp":"2026-10-16 16:02:00","device":"Desktop","click_duration":29.42,"scroll_depth":90.5,"mouse_movement":61.1,"keystrokes_detected":1,"ad_position":"Top","click_frequency":5,"time_since_last_click":22.86,"device_ip_reputation":0.91,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":13.8,"demo_record":1},{"click_id":"CG-0108","ip_address":"184.105.250.24","timestamp":"2026-10-16 16:52:00","device":"Desktop","click_duration":34.46,"scroll_depth":58.4,"mouse_movement":55.2,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":5,"time_since_last_click":13.22,"device_ip_reputation":0.75,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":31.4,"demo_record":1},{"click_id":"CG-0109","ip_address":"21.216.176.180","timestamp":"2026-10-16 11:43:00","device":"Desktop","click_duration":5.23,"scroll_depth":99.6,"mouse_movement":98.9,"keystrokes_detected":1,"ad_position":"Top","click_frequency":3,"time_since_last_click":75.37,"device_ip_reputation":0.89,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":37.7,"demo_record":1},{"click_id":"CG-0110","ip_address":"106.192.41.175","timestamp":"2026-10-16 14:31:00","device":"Desktop","click_duration":36.75,"scroll_depth":90.6,"mouse_movement":71.6,"keystrokes_detected":1,"ad_position":"Top","click_frequency":2,"time_since_last_click":178.73,"device_ip_reputation":0.72,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":37.2,"demo_record":1},{"click_id":"CG-0111","ip_address":"149.217.194.211","timestamp":"2026-10-16 15:54:00","device":"Desktop","click_duration":11.04,"scroll_depth":59.5,"mouse_movement":40.6,"keystrokes_detected":0,"ad_position":"Top","click_frequency":7,"time_since_last_click":119.85,"device_ip_reputation":0.82,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":4.4,"demo_record":1},{"click_id":"CG-0112","ip_address":"163.24.125.190","timestamp":"2026-10-16 18:08:00","device":"Tablet","click_duration":0.27,"scroll_depth":9.7,"mouse_movement":3.9,"keystrokes_detected":0,"ad_position":"Sidebar","click_frequency":24,"time_since_last_click":2.48,"device_ip_reputation":0.13,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"Android","is_fraudulent":1,"classification":"Fraud","risk_score":80.1,"demo_record":1},{"click_id":"CG-0113","ip_address":"143.113.211.77","timestamp":"2026-10-16 10:26:00","device":"Tablet","click_duration":12.63,"scroll_depth":66.8,"mouse_movement":90.1,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":5,"time_since_last_click":90.72,"device_ip_reputation":0.98,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":16.7,"demo_record":1},{"click_id":"CG-0114","ip_address":"203.242.123.218","timestamp":"2026-10-16 13:07:00","device":"Desktop","click_duration":10.89,"scroll_depth":89.3,"mouse_movement":84.1,"keystrokes_detected":0,"ad_position":"Bottom","click_frequency":4,"time_since_last_click":101.64,"device_ip_reputation":0.61,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":32.5,"demo_record":1},{"click_id":"CG-0115","ip_address":"222.97.26.69","timestamp":"2026-10-16 09:34:00","device":"Desktop","click_duration":16.2,"scroll_depth":70.4,"mouse_movement":89.6,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":4,"time_since_last_click":39.97,"device_ip_reputation":0.95,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":36.6,"demo_record":1},{"click_id":"CG-0116","ip_address":"203.245.124.179","timestamp":"2026-10-16 10:00:00","device":"Desktop","click_duration":24.15,"scroll_depth":40.3,"mouse_movement":63.3,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":4,"time_since_last_click":97.46,"device_ip_reputation":0.71,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":5.5,"demo_record":1},{"click_id":"CG-0117","ip_address":"91.104.189.81","timestamp":"2026-10-16 16:00:00","device":"Desktop","click_duration":17.49,"scroll_depth":67.2,"mouse_movement":78.8,"keystrokes_detected":0,"ad_position":"Feed","click_frequency":5,"time_since_last_click":168.45,"device_ip_reputation":0.8,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":15.7,"demo_record":1},{"click_id":"CG-0118","ip_address":"177.172.131.196","timestamp":"2026-10-16 12:11:00","device":"Tablet","click_duration":31.76,"scroll_depth":97.5,"mouse_movement":78.6,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":6,"time_since_last_click":143.71,"device_ip_reputation":0.62,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":3.2,"demo_record":1},{"click_id":"CG-0119","ip_address":"181.24.3.106","timestamp":"2026-10-16 09:16:00","device":"Desktop","click_duration":7.81,"scroll_depth":72.3,"mouse_movement":76.0,"keystrokes_detected":0,"ad_position":"Sidebar","click_frequency":5,"time_since_last_click":83.71,"device_ip_reputation":0.58,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":2.6,"demo_record":1},{"click_id":"CG-0120","ip_address":"13.8.140.138","timestamp":"2026-10-16 17:04:00","device":"Tablet","click_duration":37.21,"scroll_depth":26.3,"mouse_movement":73.3,"keystrokes_detected":1,"ad_position":"Top","click_frequency":1,"time_since_last_click":95.82,"device_ip_reputation":0.66,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":30.6,"demo_record":1},{"click_id":"CG-0121","ip_address":"113.235.124.254","timestamp":"2026-10-16 09:20:00","device":"Desktop","click_duration":27.4,"scroll_depth":47.5,"mouse_movement":71.6,"keystrokes_detected":0,"ad_position":"Top","click_frequency":4,"time_since_last_click":70.13,"device_ip_reputation":0.79,"VPN_usage":1,"proxy_usage":1,"browser":"Safari","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":20.0,"demo_record":1},{"click_id":"CG-0122","ip_address":"94.48.21.59","timestamp":"2026-10-16 15:24:00","device":"Tablet","click_duration":10.4,"scroll_depth":90.1,"mouse_movement":57.0,"keystrokes_detected":0,"ad_position":"Top","click_frequency":6,"time_since_last_click":166.83,"device_ip_reputation":0.95,"VPN_usage":0,"proxy_usage":1,"browser":"Firefox","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":36.6,"demo_record":1},{"click_id":"CG-0123","ip_address":"220.203.39.77","timestamp":"2026-10-16 18:01:00","device":"Mobile","click_duration":0.58,"scroll_depth":5.3,"mouse_movement":12.2,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":20,"time_since_last_click":1.91,"device_ip_reputation":0.1,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"Windows","is_fraudulent":1,"classification":"Fraud","risk_score":74.6,"demo_record":1},{"click_id":"CG-0124","ip_address":"97.203.167.8","timestamp":"2026-10-16 11:57:00","device":"Mobile","click_duration":25.19,"scroll_depth":83.8,"mouse_movement":58.2,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":4,"time_since_last_click":35.88,"device_ip_reputation":0.81,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":27.7,"demo_record":1},{"click_id":"CG-0125","ip_address":"107.78.199.82","timestamp":"2026-10-16 09:24:00","device":"Mobile","click_duration":15.62,"scroll_depth":31.9,"mouse_movement":54.5,"keystrokes_detected":1,"ad_position":"Top","click_frequency":2,"time_since_last_click":18.45,"device_ip_reputation":0.74,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":5.2,"demo_record":1},{"click_id":"CG-0126","ip_address":"163.166.197.4","timestamp":"2026-10-16 17:27:00","device":"Desktop","click_duration":0.92,"scroll_depth":8.5,"mouse_movement":13.0,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":26,"time_since_last_click":1.35,"device_ip_reputation":0.29,"VPN_usage":1,"proxy_usage":1,"browser":"Firefox","operating_system":"macOS","is_fraudulent":1,"classification":"Fraud","risk_score":75.9,"demo_record":1},{"click_id":"CG-0127","ip_address":"117.153.247.201","timestamp":"2026-10-16 10:51:00","device":"Desktop","click_duration":5.69,"scroll_depth":43.9,"mouse_movement":77.1,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":4,"time_since_last_click":21.93,"device_ip_reputation":0.68,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":17.8,"demo_record":1},{"click_id":"CG-0128","ip_address":"176.69.153.83","timestamp":"2026-10-16 15:20:00","device":"Mobile","click_duration":24.11,"scroll_depth":77.1,"mouse_movement":43.8,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":3,"time_since_last_click":133.07,"device_ip_reputation":0.83,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":12.1,"demo_record":1},{"click_id":"CG-0129","ip_address":"154.102.92.175","timestamp":"2026-10-16 14:42:00","device":"Tablet","click_duration":29.87,"scroll_depth":27.0,"mouse_movement":55.9,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":7,"time_since_last_click":54.57,"device_ip_reputation":0.85,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":7.0,"demo_record":1},{"click_id":"CG-0130","ip_address":"178.78.216.203","timestamp":"2026-10-16 13:10:00","device":"Tablet","click_duration":16.19,"scroll_depth":58.7,"mouse_movement":57.3,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":5,"time_since_last_click":9.51,"device_ip_reputation":0.98,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":29.7,"demo_record":1},{"click_id":"CG-0131","ip_address":"52.22.204.248","timestamp":"2026-10-16 19:13:00","device":"Mobile","click_duration":29.34,"scroll_depth":97.4,"mouse_movement":26.7,"keystrokes_detected":0,"ad_position":"Feed","click_frequency":2,"time_since_last_click":93.39,"device_ip_reputation":0.78,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":16.1,"demo_record":1},{"click_id":"CG-0132","ip_address":"138.77.176.7","timestamp":"2026-10-16 19:35:00","device":"Desktop","click_duration":19.9,"scroll_depth":47.2,"mouse_movement":27.5,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":3,"time_since_last_click":63.72,"device_ip_reputation":0.9,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":28.0,"demo_record":1},{"click_id":"CG-0133","ip_address":"86.22.58.6","timestamp":"2026-10-16 15:43:00","device":"Tablet","click_duration":32.72,"scroll_depth":73.6,"mouse_movement":83.6,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":5,"time_since_last_click":31.34,"device_ip_reputation":0.8,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":8.7,"demo_record":1},{"click_id":"CG-0134","ip_address":"17.101.230.152","timestamp":"2026-10-16 19:13:00","device":"Desktop","click_duration":18.03,"scroll_depth":25.3,"mouse_movement":34.9,"keystrokes_detected":0,"ad_position":"Top","click_frequency":7,"time_since_last_click":157.34,"device_ip_reputation":0.63,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":21.0,"demo_record":1},{"click_id":"CG-0135","ip_address":"109.200.58.90","timestamp":"2026-10-16 18:54:00","device":"Desktop","click_duration":15.32,"scroll_depth":59.3,"mouse_movement":84.7,"keystrokes_detected":1,"ad_position":"Top","click_frequency":6,"time_since_last_click":26.71,"device_ip_reputation":0.6,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":16.0,"demo_record":1},{"click_id":"CG-0136","ip_address":"108.216.95.125","timestamp":"2026-10-16 18:10:00","device":"Tablet","click_duration":1.83,"scroll_depth":15.3,"mouse_movement":16.8,"keystrokes_detected":0,"ad_position":"Sidebar","click_frequency":23,"time_since_last_click":0.79,"device_ip_reputation":0.12,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"Windows","is_fraudulent":1,"classification":"Fraud","risk_score":85.1,"demo_record":1},{"click_id":"CG-0137","ip_address":"153.253.209.176","timestamp":"2026-10-16 11:19:00","device":"Mobile","click_duration":20.21,"scroll_depth":78.3,"mouse_movement":58.1,"keystrokes_detected":0,"ad_position":"Top","click_frequency":7,"time_since_last_click":137.71,"device_ip_reputation":0.68,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":22.4,"demo_record":1},{"click_id":"CG-0138","ip_address":"38.58.137.199","timestamp":"2026-10-16 16:27:00","device":"Tablet","click_duration":22.01,"scroll_depth":99.3,"mouse_movement":85.5,"keystrokes_detected":0,"ad_position":"Bottom","click_frequency":5,"time_since_last_click":41.68,"device_ip_reputation":0.74,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":33.5,"demo_record":1},{"click_id":"CG-0139","ip_address":"99.44.224.222","timestamp":"2026-10-16 08:33:00","device":"Desktop","click_duration":37.79,"scroll_depth":83.2,"mouse_movement":35.2,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":2,"time_since_last_click":112.06,"device_ip_reputation":0.9,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":12.1,"demo_record":1},{"click_id":"CG-0140","ip_address":"190.149.148.147","timestamp":"2026-10-16 17:11:00","device":"Tablet","click_duration":0.86,"scroll_depth":18.9,"mouse_movement":14.7,"keystrokes_detected":0,"ad_position":"Bottom","click_frequency":9,"time_since_last_click":2.48,"device_ip_reputation":0.35,"VPN_usage":1,"proxy_usage":0,"browser":"Safari","operating_system":"Android","is_fraudulent":1,"classification":"Fraud","risk_score":91.2,"demo_record":1},{"click_id":"CG-0141","ip_address":"183.201.250.37","timestamp":"2026-10-16 12:13:00","device":"Mobile","click_duration":23.21,"scroll_depth":45.2,"mouse_movement":48.8,"keystrokes_detected":0,"ad_position":"Top","click_frequency":4,"time_since_last_click":94.26,"device_ip_reputation":0.67,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":23.0,"demo_record":1},{"click_id":"CG-0142","ip_address":"127.183.32.204","timestamp":"2026-10-16 09:35:00","device":"Mobile","click_duration":21.7,"scroll_depth":41.3,"mouse_movement":85.6,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":3,"time_since_last_click":149.62,"device_ip_reputation":0.7,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":34.2,"demo_record":1},{"click_id":"CG-0143","ip_address":"170.235.8.32","timestamp":"2026-10-16 08:49:00","device":"Mobile","click_duration":2.61,"scroll_depth":3.5,"mouse_movement":0.0,"keystrokes_detected":0,"ad_position":"Sidebar","click_frequency":30,"time_since_last_click":2.28,"device_ip_reputation":0.36,"VPN_usage":1,"proxy_usage":0,"browser":"Firefox","operating_system":"Windows","is_fraudulent":1,"classification":"Fraud","risk_score":89.7,"demo_record":1},{"click_id":"CG-0144","ip_address":"180.84.26.102","timestamp":"2026-10-16 12:16:00","device":"Desktop","click_duration":1.81,"scroll_depth":16.0,"mouse_movement":7.7,"keystrokes_detected":0,"ad_position":"Top","click_frequency":8,"time_since_last_click":0.61,"device_ip_reputation":0.08,"VPN_usage":1,"proxy_usage":0,"browser":"Edge","operating_system":"Windows","is_fraudulent":1,"classification":"Fraud","risk_score":72.2,"demo_record":1},{"click_id":"CG-0145","ip_address":"118.67.244.19","timestamp":"2026-10-16 13:51:00","device":"Desktop","click_duration":11.01,"scroll_depth":31.7,"mouse_movement":26.5,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":2,"time_since_last_click":70.74,"device_ip_reputation":0.91,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":21.1,"demo_record":1},{"click_id":"CG-0146","ip_address":"52.225.179.185","timestamp":"2026-10-16 08:08:00","device":"Mobile","click_duration":10.46,"scroll_depth":81.1,"mouse_movement":68.5,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":1,"time_since_last_click":161.7,"device_ip_reputation":0.61,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":13.3,"demo_record":1},{"click_id":"CG-0147","ip_address":"175.43.127.142","timestamp":"2026-10-16 10:23:00","device":"Mobile","click_duration":24.03,"scroll_depth":79.1,"mouse_movement":81.9,"keystrokes_detected":0,"ad_position":"Feed","click_frequency":2,"time_since_last_click":94.64,"device_ip_reputation":0.77,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":19.8,"demo_record":1},{"click_id":"CG-0148","ip_address":"173.36.6.253","timestamp":"2026-10-16 09:55:00","device":"Mobile","click_duration":15.64,"scroll_depth":48.7,"mouse_movement":88.6,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":5,"time_since_last_click":123.88,"device_ip_reputation":0.89,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":4.4,"demo_record":1},{"click_id":"CG-0149","ip_address":"25.203.146.161","timestamp":"2026-10-16 12:28:00","device":"Mobile","click_duration":2.04,"scroll_depth":16.9,"mouse_movement":12.6,"keystrokes_detected":0,"ad_position":"Sidebar","click_frequency":16,"time_since_last_click":0.3,"device_ip_reputation":0.08,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Linux","is_fraudulent":1,"classification":"Fraud","risk_score":80.8,"demo_record":1},{"click_id":"CG-0150","ip_address":"223.33.158.179","timestamp":"2026-10-16 18:00:00","device":"Desktop","click_duration":18.31,"scroll_depth":96.5,"mouse_movement":22.7,"keystrokes_detected":0,"ad_position":"Bottom","click_frequency":1,"time_since_last_click":83.25,"device_ip_reputation":0.82,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":2.5,"demo_record":1},{"click_id":"CG-0151","ip_address":"51.254.177.134","timestamp":"2026-10-16 10:20:00","device":"Mobile","click_duration":21.1,"scroll_depth":86.7,"mouse_movement":31.7,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":6,"time_since_last_click":159.9,"device_ip_reputation":0.89,"VPN_usage":1,"proxy_usage":0,"browser":"Firefox","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":4.3,"demo_record":1},{"click_id":"CG-0152","ip_address":"137.233.184.15","timestamp":"2026-10-16 17:50:00","device":"Mobile","click_duration":20.49,"scroll_depth":67.5,"mouse_movement":30.9,"keystrokes_detected":0,"ad_position":"Top","click_frequency":2,"time_since_last_click":134.12,"device_ip_reputation":0.55,"VPN_usage":0,"proxy_usage":1,"browser":"Chrome","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":15.1,"demo_record":1},{"click_id":"CG-0153","ip_address":"19.214.114.83","timestamp":"2026-10-16 10:33:00","device":"Mobile","click_duration":0.81,"scroll_depth":20.1,"mouse_movement":4.9,"keystrokes_detected":0,"ad_position":"Feed","click_frequency":11,"time_since_last_click":1.3,"device_ip_reputation":0.37,"VPN_usage":1,"proxy_usage":0,"browser":"Chrome","operating_system":"macOS","is_fraudulent":1,"classification":"Fraud","risk_score":73.9,"demo_record":1},{"click_id":"CG-0154","ip_address":"208.159.167.23","timestamp":"2026-10-16 15:56:00","device":"Desktop","click_duration":22.36,"scroll_depth":25.6,"mouse_movement":41.9,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":4,"time_since_last_click":68.18,"device_ip_reputation":0.98,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":2.2,"demo_record":1},{"click_id":"CG-0155","ip_address":"148.177.4.244","timestamp":"2026-10-16 14:59:00","device":"Mobile","click_duration":1.04,"scroll_depth":16.7,"mouse_movement":15.3,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":11,"time_since_last_click":0.59,"device_ip_reputation":0.39,"VPN_usage":1,"proxy_usage":0,"browser":"Safari","operating_system":"iOS","is_fraudulent":1,"classification":"Fraud","risk_score":74.5,"demo_record":1},{"click_id":"CG-0156","ip_address":"143.211.190.118","timestamp":"2026-10-16 11:57:00","device":"Desktop","click_duration":37.11,"scroll_depth":31.4,"mouse_movement":59.4,"keystrokes_detected":1,"ad_position":"Top","click_frequency":5,"time_since_last_click":103.5,"device_ip_reputation":0.74,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":35.3,"demo_record":1},{"click_id":"CG-0157","ip_address":"198.167.162.116","timestamp":"2026-10-16 14:42:00","device":"Desktop","click_duration":12.52,"scroll_depth":30.6,"mouse_movement":29.2,"keystrokes_detected":0,"ad_position":"Sidebar","click_frequency":1,"time_since_last_click":32.09,"device_ip_reputation":0.76,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":13.1,"demo_record":1},{"click_id":"CG-0158","ip_address":"33.80.155.212","timestamp":"2026-10-16 12:31:00","device":"Desktop","click_duration":27.66,"scroll_depth":70.2,"mouse_movement":86.5,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":1,"time_since_last_click":128.87,"device_ip_reputation":0.98,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":31.5,"demo_record":1},{"click_id":"CG-0159","ip_address":"113.231.127.25","timestamp":"2026-10-16 10:58:00","device":"Desktop","click_duration":1.37,"scroll_depth":17.7,"mouse_movement":2.2,"keystrokes_detected":0,"ad_position":"Sidebar","click_frequency":12,"time_since_last_click":0.58,"device_ip_reputation":0.19,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"Linux","is_fraudulent":1,"classification":"Fraud","risk_score":87.8,"demo_record":1},{"click_id":"CG-0160","ip_address":"26.101.227.208","timestamp":"2026-10-16 09:16:00","device":"Mobile","click_duration":0.49,"scroll_depth":19.9,"mouse_movement":2.2,"keystrokes_detected":0,"ad_position":"Top","click_frequency":13,"time_since_last_click":2.32,"device_ip_reputation":0.2,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"macOS","is_fraudulent":1,"classification":"Fraud","risk_score":76.7,"demo_record":1},{"click_id":"CG-0161","ip_address":"80.143.228.227","timestamp":"2026-10-16 11:39:00","device":"Tablet","click_duration":8.2,"scroll_depth":71.1,"mouse_movement":38.2,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":4,"time_since_last_click":159.25,"device_ip_reputation":0.76,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":25.1,"demo_record":1},{"click_id":"CG-0162","ip_address":"215.9.195.201","timestamp":"2026-10-16 16:58:00","device":"Mobile","click_duration":27.97,"scroll_depth":61.0,"mouse_movement":46.2,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":3,"time_since_last_click":34.83,"device_ip_reputation":0.69,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":31.1,"demo_record":1},{"click_id":"CG-0163","ip_address":"206.119.81.26","timestamp":"2026-10-16 16:03:00","device":"Tablet","click_duration":11.67,"scroll_depth":43.1,"mouse_movement":84.9,"keystrokes_detected":0,"ad_position":"Sidebar","click_frequency":5,"time_since_last_click":152.83,"device_ip_reputation":0.9,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":10.5,"demo_record":1},{"click_id":"CG-0164","ip_address":"188.183.14.181","timestamp":"2026-10-16 13:25:00","device":"Tablet","click_duration":27.52,"scroll_depth":96.1,"mouse_movement":29.7,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":5,"time_since_last_click":57.7,"device_ip_reputation":0.77,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":21.0,"demo_record":1},{"click_id":"CG-0165","ip_address":"167.103.66.88","timestamp":"2026-10-16 08:00:00","device":"Mobile","click_duration":28.09,"scroll_depth":93.9,"mouse_movement":22.9,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":7,"time_since_last_click":22.63,"device_ip_reputation":0.78,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":5.6,"demo_record":1},{"click_id":"CG-0166","ip_address":"50.223.249.167","timestamp":"2026-10-16 13:09:00","device":"Tablet","click_duration":14.1,"scroll_depth":78.0,"mouse_movement":74.9,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":6,"time_since_last_click":107.24,"device_ip_reputation":0.63,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":28.2,"demo_record":1},{"click_id":"CG-0167","ip_address":"110.16.93.155","timestamp":"2026-10-16 19:58:00","device":"Tablet","click_duration":14.14,"scroll_depth":85.7,"mouse_movement":36.1,"keystrokes_detected":0,"ad_position":"Bottom","click_frequency":2,"time_since_last_click":61.62,"device_ip_reputation":0.58,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":18.1,"demo_record":1},{"click_id":"CG-0168","ip_address":"187.34.179.66","timestamp":"2026-10-16 12:31:00","device":"Desktop","click_duration":2.24,"scroll_depth":15.8,"mouse_movement":6.9,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":13,"time_since_last_click":2.22,"device_ip_reputation":0.22,"VPN_usage":1,"proxy_usage":0,"browser":"Chrome","operating_system":"macOS","is_fraudulent":1,"classification":"Fraud","risk_score":93.3,"demo_record":1},{"click_id":"CG-0169","ip_address":"185.115.83.116","timestamp":"2026-10-16 17:51:00","device":"Mobile","click_duration":5.58,"scroll_depth":88.4,"mouse_movement":19.6,"keystrokes_detected":1,"ad_position":"Top","click_frequency":1,"time_since_last_click":63.5,"device_ip_reputation":0.94,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":23.4,"demo_record":1},{"click_id":"CG-0170","ip_address":"190.15.220.242","timestamp":"2026-10-16 18:28:00","device":"Mobile","click_duration":25.88,"scroll_depth":70.5,"mouse_movement":30.9,"keystrokes_detected":0,"ad_position":"Feed","click_frequency":2,"time_since_last_click":175.47,"device_ip_reputation":0.73,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":12.7,"demo_record":1},{"click_id":"CG-0171","ip_address":"156.251.78.14","timestamp":"2026-10-16 09:38:00","device":"Mobile","click_duration":1.11,"scroll_depth":9.4,"mouse_movement":14.8,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":14,"time_since_last_click":0.33,"device_ip_reputation":0.12,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"Windows","is_fraudulent":1,"classification":"Fraud","risk_score":80.3,"demo_record":1},{"click_id":"CG-0172","ip_address":"179.135.46.165","timestamp":"2026-10-16 14:47:00","device":"Mobile","click_duration":22.04,"scroll_depth":38.9,"mouse_movement":48.3,"keystrokes_detected":1,"ad_position":"Top","click_frequency":3,"time_since_last_click":80.83,"device_ip_reputation":0.67,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":5.1,"demo_record":1},{"click_id":"CG-0173","ip_address":"115.116.31.216","timestamp":"2026-10-16 13:52:00","device":"Tablet","click_duration":16.55,"scroll_depth":64.2,"mouse_movement":74.3,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":4,"time_since_last_click":55.9,"device_ip_reputation":0.72,"VPN_usage":0,"proxy_usage":1,"browser":"Safari","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":36.2,"demo_record":1},{"click_id":"CG-0174","ip_address":"52.108.98.33","timestamp":"2026-10-16 15:39:00","device":"Tablet","click_duration":0.26,"scroll_depth":1.7,"mouse_movement":7.8,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":34,"time_since_last_click":1.53,"device_ip_reputation":0.16,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"macOS","is_fraudulent":1,"classification":"Fraud","risk_score":87.0,"demo_record":1},{"click_id":"CG-0175","ip_address":"80.234.6.202","timestamp":"2026-10-16 17:25:00","device":"Mobile","click_duration":27.51,"scroll_depth":69.1,"mouse_movement":27.2,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":5,"time_since_last_click":107.06,"device_ip_reputation":0.88,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":33.2,"demo_record":1},{"click_id":"CG-0176","ip_address":"77.196.248.147","timestamp":"2026-10-16 13:52:00","device":"Mobile","click_duration":24.31,"scroll_depth":27.8,"mouse_movement":51.0,"keystrokes_detected":1,"ad_position":"Top","click_frequency":4,"time_since_last_click":160.45,"device_ip_reputation":0.7,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":2.7,"demo_record":1},{"click_id":"CG-0177","ip_address":"135.50.116.35","timestamp":"2026-10-16 13:10:00","device":"Mobile","click_duration":13.52,"scroll_depth":80.8,"mouse_movement":40.1,"keystrokes_detected":1,"ad_position":"Top","click_frequency":2,"time_since_last_click":81.18,"device_ip_reputation":0.95,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":20.5,"demo_record":1},{"click_id":"CG-0178","ip_address":"191.206.69.200","timestamp":"2026-10-16 10:42:00","device":"Desktop","click_duration":2.41,"scroll_depth":19.3,"mouse_movement":3.1,"keystrokes_detected":0,"ad_position":"Top","click_frequency":15,"time_since_last_click":0.18,"device_ip_reputation":0.07,"VPN_usage":1,"proxy_usage":1,"browser":"Firefox","operating_system":"macOS","is_fraudulent":1,"classification":"Fraud","risk_score":85.6,"demo_record":1},{"click_id":"CG-0179","ip_address":"184.15.123.96","timestamp":"2026-10-16 18:50:00","device":"Mobile","click_duration":20.11,"scroll_depth":58.5,"mouse_movement":66.1,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":2,"time_since_last_click":151.26,"device_ip_reputation":0.66,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":3.8,"demo_record":1},{"click_id":"CG-0180","ip_address":"64.113.115.174","timestamp":"2026-10-16 17:45:00","device":"Tablet","click_duration":10.24,"scroll_depth":73.9,"mouse_movement":19.6,"keystrokes_detected":0,"ad_position":"Bottom","click_frequency":2,"time_since_last_click":117.58,"device_ip_reputation":0.81,"VPN_usage":1,"proxy_usage":0,"browser":"Firefox","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":17.3,"demo_record":1},{"click_id":"CG-0181","ip_address":"127.129.111.120","timestamp":"2026-10-16 14:25:00","device":"Tablet","click_duration":13.58,"scroll_depth":64.0,"mouse_movement":50.6,"keystrokes_detected":0,"ad_position":"Top","click_frequency":5,"time_since_last_click":179.9,"device_ip_reputation":0.98,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":26.6,"demo_record":1},{"click_id":"CG-0182","ip_address":"80.166.141.67","timestamp":"2026-10-16 16:13:00","device":"Tablet","click_duration":1.89,"scroll_depth":20.9,"mouse_movement":5.4,"keystrokes_detected":0,"ad_position":"Sidebar","click_frequency":36,"time_since_last_click":0.24,"device_ip_reputation":0.35,"VPN_usage":0,"proxy_usage":1,"browser":"Firefox","operating_system":"Android","is_fraudulent":1,"classification":"Fraud","risk_score":91.5,"demo_record":1},{"click_id":"CG-0183","ip_address":"85.132.214.104","timestamp":"2026-10-16 19:11:00","device":"Tablet","click_duration":16.59,"scroll_depth":27.6,"mouse_movement":99.6,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":6,"time_since_last_click":129.27,"device_ip_reputation":0.85,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":12.8,"demo_record":1},{"click_id":"CG-0184","ip_address":"152.92.150.25","timestamp":"2026-10-16 10:54:00","device":"Tablet","click_duration":19.48,"scroll_depth":80.6,"mouse_movement":84.3,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":6,"time_since_last_click":18.81,"device_ip_reputation":0.71,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":11.4,"demo_record":1},{"click_id":"CG-0185","ip_address":"40.240.27.222","timestamp":"2026-10-16 13:01:00","device":"Tablet","click_duration":25.2,"scroll_depth":68.5,"mouse_movement":23.8,"keystrokes_detected":1,"ad_position":"Top","click_frequency":7,"time_since_last_click":123.48,"device_ip_reputation":0.78,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":37.7,"demo_record":1},{"click_id":"CG-0186","ip_address":"155.234.73.81","timestamp":"2026-10-16 13:50:00","device":"Desktop","click_duration":33.18,"scroll_depth":38.5,"mouse_movement":58.0,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":6,"time_since_last_click":13.27,"device_ip_reputation":0.75,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":30.3,"demo_record":1},{"click_id":"CG-0187","ip_address":"121.219.206.110","timestamp":"2026-10-16 09:30:00","device":"Desktop","click_duration":2.71,"scroll_depth":8.4,"mouse_movement":9.6,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":8,"time_since_last_click":2.24,"device_ip_reputation":0.31,"VPN_usage":1,"proxy_usage":1,"browser":"Chrome","operating_system":"Android","is_fraudulent":1,"classification":"Fraud","risk_score":78.1,"demo_record":1},{"click_id":"CG-0188","ip_address":"36.196.156.43","timestamp":"2026-10-16 13:52:00","device":"Mobile","click_duration":5.29,"scroll_depth":28.4,"mouse_movement":55.4,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":6,"time_since_last_click":179.2,"device_ip_reputation":0.7,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":36.1,"demo_record":1},{"click_id":"CG-0189","ip_address":"67.67.108.188","timestamp":"2026-10-16 14:53:00","device":"Desktop","click_duration":0.21,"scroll_depth":11.1,"mouse_movement":6.6,"keystrokes_detected":1,"ad_position":"Top","click_frequency":20,"time_since_last_click":2.2,"device_ip_reputation":0.14,"VPN_usage":1,"proxy_usage":1,"browser":"Chrome","operating_system":"Windows","is_fraudulent":1,"classification":"Fraud","risk_score":89.6,"demo_record":1},{"click_id":"CG-0190","ip_address":"39.213.227.98","timestamp":"2026-10-16 08:20:00","device":"Tablet","click_duration":0.48,"scroll_depth":5.6,"mouse_movement":2.8,"keystrokes_detected":1,"ad_position":"Top","click_frequency":17,"time_since_last_click":1.11,"device_ip_reputation":0.09,"VPN_usage":1,"proxy_usage":0,"browser":"Safari","operating_system":"macOS","is_fraudulent":1,"classification":"Fraud","risk_score":94.4,"demo_record":1},{"click_id":"CG-0191","ip_address":"168.60.144.30","timestamp":"2026-10-16 09:47:00","device":"Tablet","click_duration":30.47,"scroll_depth":62.3,"mouse_movement":34.4,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":3,"time_since_last_click":127.51,"device_ip_reputation":0.68,"VPN_usage":1,"proxy_usage":0,"browser":"Safari","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":13.9,"demo_record":1},{"click_id":"CG-0192","ip_address":"32.56.252.39","timestamp":"2026-10-16 08:02:00","device":"Desktop","click_duration":2.67,"scroll_depth":17.1,"mouse_movement":13.0,"keystrokes_detected":0,"ad_position":"Feed","click_frequency":28,"time_since_last_click":0.65,"device_ip_reputation":0.4,"VPN_usage":1,"proxy_usage":1,"browser":"Chrome","operating_system":"Android","is_fraudulent":1,"classification":"Fraud","risk_score":95.6,"demo_record":1},{"click_id":"CG-0193","ip_address":"183.160.218.190","timestamp":"2026-10-16 12:57:00","device":"Desktop","click_duration":7.06,"scroll_depth":88.8,"mouse_movement":18.8,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":3,"time_since_last_click":66.28,"device_ip_reputation":0.74,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":31.3,"demo_record":1},{"click_id":"CG-0194","ip_address":"112.233.139.214","timestamp":"2026-10-16 11:07:00","device":"Mobile","click_duration":1.17,"scroll_depth":18.7,"mouse_movement":11.7,"keystrokes_detected":0,"ad_position":"Top","click_frequency":12,"time_since_last_click":1.77,"device_ip_reputation":0.07,"VPN_usage":0,"proxy_usage":1,"browser":"Edge","operating_system":"Linux","is_fraudulent":1,"classification":"Fraud","risk_score":85.0,"demo_record":1},{"click_id":"CG-0195","ip_address":"56.194.183.157","timestamp":"2026-10-16 17:42:00","device":"Tablet","click_duration":4.01,"scroll_depth":76.3,"mouse_movement":97.8,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":4,"time_since_last_click":22.99,"device_ip_reputation":0.73,"VPN_usage":1,"proxy_usage":0,"browser":"Firefox","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":27.4,"demo_record":1},{"click_id":"CG-0196","ip_address":"200.114.173.133","timestamp":"2026-10-16 19:34:00","device":"Desktop","click_duration":21.31,"scroll_depth":77.5,"mouse_movement":53.5,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":3,"time_since_last_click":120.48,"device_ip_reputation":0.83,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":25.2,"demo_record":1},{"click_id":"CG-0197","ip_address":"130.253.84.20","timestamp":"2026-10-16 10:40:00","device":"Mobile","click_duration":29.3,"scroll_depth":49.0,"mouse_movement":97.6,"keystrokes_detected":0,"ad_position":"Sidebar","click_frequency":5,"time_since_last_click":116.87,"device_ip_reputation":0.73,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":32.8,"demo_record":1},{"click_id":"CG-0198","ip_address":"137.9.52.104","timestamp":"2026-10-16 15:37:00","device":"Desktop","click_duration":17.43,"scroll_depth":66.8,"mouse_movement":85.7,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":6,"time_since_last_click":121.85,"device_ip_reputation":0.97,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":14.0,"demo_record":1},{"click_id":"CG-0199","ip_address":"193.186.231.30","timestamp":"2026-10-16 18:34:00","device":"Desktop","click_duration":6.41,"scroll_depth":74.4,"mouse_movement":46.0,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":6,"time_since_last_click":21.82,"device_ip_reputation":0.94,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":11.2,"demo_record":1},{"click_id":"CG-0200","ip_address":"110.110.234.212","timestamp":"2026-10-16 11:20:00","device":"Desktop","click_duration":2.22,"scroll_depth":15.8,"mouse_movement":13.6,"keystrokes_detected":0,"ad_position":"Top","click_frequency":32,"time_since_last_click":2.24,"device_ip_reputation":0.21,"VPN_usage":1,"proxy_usage":0,"browser":"Edge","operating_system":"Windows","is_fraudulent":1,"classification":"Fraud","risk_score":86.3,"demo_record":1},{"click_id":"CG-0201","ip_address":"120.247.90.178","timestamp":"2026-10-16 08:49:00","device":"Desktop","click_duration":23.25,"scroll_depth":79.8,"mouse_movement":26.5,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":4,"time_since_last_click":176.37,"device_ip_reputation":0.95,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":18.3,"demo_record":1},{"click_id":"CG-0202","ip_address":"164.153.160.183","timestamp":"2026-10-16 10:16:00","device":"Desktop","click_duration":2.1,"scroll_depth":12.2,"mouse_movement":3.6,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":29,"time_since_last_click":0.93,"device_ip_reputation":0.29,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Linux","is_fraudulent":1,"classification":"Fraud","risk_score":86.6,"demo_record":1},{"click_id":"CG-0203","ip_address":"39.180.245.150","timestamp":"2026-10-16 18:52:00","device":"Mobile","click_duration":22.97,"scroll_depth":75.0,"mouse_movement":73.3,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":7,"time_since_last_click":5.26,"device_ip_reputation":0.6,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":11.6,"demo_record":1},{"click_id":"CG-0204","ip_address":"184.128.74.215","timestamp":"2026-10-16 10:44:00","device":"Desktop","click_duration":5.17,"scroll_depth":83.8,"mouse_movement":79.8,"keystrokes_detected":0,"ad_position":"Feed","click_frequency":7,"time_since_last_click":83.11,"device_ip_reputation":0.82,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":16.0,"demo_record":1},{"click_id":"CG-0205","ip_address":"214.147.24.238","timestamp":"2026-10-16 16:43:00","device":"Tablet","click_duration":16.36,"scroll_depth":56.2,"mouse_movement":43.6,"keystrokes_detected":0,"ad_position":"Top","click_frequency":6,"time_since_last_click":47.49,"device_ip_reputation":0.82,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":29.2,"demo_record":1},{"click_id":"CG-0206","ip_address":"60.99.150.115","timestamp":"2026-10-16 17:19:00","device":"Desktop","click_duration":9.21,"scroll_depth":76.2,"mouse_movement":96.9,"keystrokes_detected":0,"ad_position":"Bottom","click_frequency":1,"time_since_last_click":78.85,"device_ip_reputation":0.79,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":13.9,"demo_record":1},{"click_id":"CG-0207","ip_address":"92.26.154.126","timestamp":"2026-10-16 10:38:00","device":"Desktop","click_duration":2.24,"scroll_depth":12.1,"mouse_movement":14.1,"keystrokes_detected":0,"ad_position":"Sidebar","click_frequency":13,"time_since_last_click":1.35,"device_ip_reputation":0.33,"VPN_usage":1,"proxy_usage":0,"browser":"Edge","operating_system":"Windows","is_fraudulent":1,"classification":"Fraud","risk_score":81.4,"demo_record":1},{"click_id":"CG-0208","ip_address":"94.184.150.56","timestamp":"2026-10-16 11:38:00","device":"Mobile","click_duration":36.26,"scroll_depth":71.4,"mouse_movement":99.7,"keystrokes_detected":0,"ad_position":"Top","click_frequency":6,"time_since_last_click":64.24,"device_ip_reputation":0.66,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":26.6,"demo_record":1},{"click_id":"CG-0209","ip_address":"213.58.197.66","timestamp":"2026-10-16 13:28:00","device":"Tablet","click_duration":21.91,"scroll_depth":46.2,"mouse_movement":85.4,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":4,"time_since_last_click":10.76,"device_ip_reputation":0.95,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":37.0,"demo_record":1},{"click_id":"CG-0210","ip_address":"170.33.107.172","timestamp":"2026-10-16 17:10:00","device":"Tablet","click_duration":25.03,"scroll_depth":41.0,"mouse_movement":52.8,"keystrokes_detected":0,"ad_position":"Sidebar","click_frequency":5,"time_since_last_click":149.69,"device_ip_reputation":0.94,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":2.9,"demo_record":1},{"click_id":"CG-0211","ip_address":"28.27.91.204","timestamp":"2026-10-16 13:39:00","device":"Desktop","click_duration":0.82,"scroll_depth":1.5,"mouse_movement":16.4,"keystrokes_detected":0,"ad_position":"Bottom","click_frequency":22,"time_since_last_click":1.61,"device_ip_reputation":0.2,"VPN_usage":1,"proxy_usage":0,"browser":"Chrome","operating_system":"Linux","is_fraudulent":1,"classification":"Fraud","risk_score":73.7,"demo_record":1},{"click_id":"CG-0212","ip_address":"28.183.54.75","timestamp":"2026-10-16 17:59:00","device":"Desktop","click_duration":2.24,"scroll_depth":6.6,"mouse_movement":5.1,"keystrokes_detected":0,"ad_position":"Bottom","click_frequency":20,"time_since_last_click":2.07,"device_ip_reputation":0.06,"VPN_usage":1,"proxy_usage":1,"browser":"Edge","operating_system":"Linux","is_fraudulent":1,"classification":"Fraud","risk_score":80.0,"demo_record":1},{"click_id":"CG-0213","ip_address":"183.191.5.142","timestamp":"2026-10-16 18:49:00","device":"Desktop","click_duration":2.47,"scroll_depth":3.1,"mouse_movement":0.1,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":25,"time_since_last_click":1.41,"device_ip_reputation":0.08,"VPN_usage":1,"proxy_usage":0,"browser":"Firefox","operating_system":"Android","is_fraudulent":1,"classification":"Fraud","risk_score":83.1,"demo_record":1},{"click_id":"CG-0214","ip_address":"46.82.94.57","timestamp":"2026-10-16 19:01:00","device":"Desktop","click_duration":24.59,"scroll_depth":44.0,"mouse_movement":32.9,"keystrokes_detected":0,"ad_position":"Bottom","click_frequency":6,"time_since_last_click":100.29,"device_ip_reputation":0.68,"VPN_usage":1,"proxy_usage":0,"browser":"Edge","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":14.9,"demo_record":1},{"click_id":"CG-0215","ip_address":"35.145.35.231","timestamp":"2026-10-16 19:27:00","device":"Mobile","click_duration":9.77,"scroll_depth":61.4,"mouse_movement":68.5,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":5,"time_since_last_click":103.33,"device_ip_reputation":0.91,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":30.3,"demo_record":1},{"click_id":"CG-0216","ip_address":"102.68.169.225","timestamp":"2026-10-16 18:56:00","device":"Mobile","click_duration":19.8,"scroll_depth":58.4,"mouse_movement":57.9,"keystrokes_detected":0,"ad_position":"Sidebar","click_frequency":6,"time_since_last_click":110.37,"device_ip_reputation":0.92,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":28.4,"demo_record":1},{"click_id":"CG-0217","ip_address":"29.9.15.209","timestamp":"2026-10-16 18:41:00","device":"Tablet","click_duration":1.69,"scroll_depth":8.9,"mouse_movement":3.8,"keystrokes_detected":0,"ad_position":"Feed","click_frequency":25,"time_since_last_click":2.25,"device_ip_reputation":0.24,"VPN_usage":0,"proxy_usage":1,"browser":"Edge","operating_system":"Android","is_fraudulent":1,"classification":"Fraud","risk_score":96.1,"demo_record":1},{"click_id":"CG-0218","ip_address":"84.68.237.129","timestamp":"2026-10-16 18:03:00","device":"Tablet","click_duration":20.86,"scroll_depth":54.8,"mouse_movement":18.9,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":7,"time_since_last_click":94.0,"device_ip_reputation":0.75,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":35.8,"demo_record":1},{"click_id":"CG-0219","ip_address":"134.118.32.68","timestamp":"2026-10-16 08:41:00","device":"Desktop","click_duration":1.13,"scroll_depth":0.9,"mouse_movement":9.3,"keystrokes_detected":0,"ad_position":"Bottom","click_frequency":23,"time_since_last_click":2.3,"device_ip_reputation":0.36,"VPN_usage":1,"proxy_usage":0,"browser":"Chrome","operating_system":"Linux","is_fraudulent":1,"classification":"Fraud","risk_score":89.1,"demo_record":1},{"click_id":"CG-0220","ip_address":"77.89.192.168","timestamp":"2026-10-16 12:40:00","device":"Desktop","click_duration":16.25,"scroll_depth":69.1,"mouse_movement":60.4,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":5,"time_since_last_click":74.83,"device_ip_reputation":0.91,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":33.8,"demo_record":1},{"click_id":"CG-0221","ip_address":"29.143.108.39","timestamp":"2026-10-16 15:30:00","device":"Tablet","click_duration":0.65,"scroll_depth":8.0,"mouse_movement":14.7,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":21,"time_since_last_click":2.05,"device_ip_reputation":0.3,"VPN_usage":1,"proxy_usage":1,"browser":"Safari","operating_system":"Linux","is_fraudulent":1,"classification":"Fraud","risk_score":76.4,"demo_record":1},{"click_id":"CG-0222","ip_address":"21.65.82.35","timestamp":"2026-10-16 15:00:00","device":"Tablet","click_duration":1.82,"scroll_depth":0.9,"mouse_movement":2.6,"keystrokes_detected":0,"ad_position":"Feed","click_frequency":13,"time_since_last_click":1.34,"device_ip_reputation":0.19,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"Windows","is_fraudulent":1,"classification":"Fraud","risk_score":77.8,"demo_record":1},{"click_id":"CG-0223","ip_address":"133.87.112.213","timestamp":"2026-10-16 18:21:00","device":"Tablet","click_duration":17.38,"scroll_depth":35.7,"mouse_movement":85.3,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":2,"time_since_last_click":131.18,"device_ip_reputation":0.7,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":15.9,"demo_record":1},{"click_id":"CG-0224","ip_address":"143.214.76.156","timestamp":"2026-10-16 09:51:00","device":"Tablet","click_duration":0.41,"scroll_depth":10.5,"mouse_movement":10.8,"keystrokes_detected":1,"ad_position":"Top","click_frequency":10,"time_since_last_click":1.26,"device_ip_reputation":0.1,"VPN_usage":1,"proxy_usage":0,"browser":"Edge","operating_system":"Linux","is_fraudulent":1,"classification":"Fraud","risk_score":83.4,"demo_record":1},{"click_id":"CG-0225","ip_address":"119.117.246.203","timestamp":"2026-10-16 08:44:00","device":"Tablet","click_duration":29.9,"scroll_depth":51.3,"mouse_movement":92.4,"keystrokes_detected":0,"ad_position":"Bottom","click_frequency":2,"time_since_last_click":48.05,"device_ip_reputation":0.89,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":8.8,"demo_record":1},{"click_id":"CG-0226","ip_address":"40.3.192.168","timestamp":"2026-10-16 08:07:00","device":"Mobile","click_duration":10.19,"scroll_depth":85.3,"mouse_movement":47.7,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":6,"time_since_last_click":106.61,"device_ip_reputation":0.66,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":29.2,"demo_record":1},{"click_id":"CG-0227","ip_address":"152.247.91.95","timestamp":"2026-10-16 15:03:00","device":"Mobile","click_duration":22.57,"scroll_depth":61.3,"mouse_movement":65.4,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":7,"time_since_last_click":155.9,"device_ip_reputation":0.6,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":9.7,"demo_record":1},{"click_id":"CG-0228","ip_address":"215.26.82.100","timestamp":"2026-10-16 14:50:00","device":"Desktop","click_duration":36.76,"scroll_depth":25.4,"mouse_movement":85.5,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":1,"time_since_last_click":14.34,"device_ip_reputation":0.65,"VPN_usage":0,"proxy_usage":1,"browser":"Edge","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":24.1,"demo_record":1},{"click_id":"CG-0229","ip_address":"162.29.89.164","timestamp":"2026-10-16 16:53:00","device":"Tablet","click_duration":20.3,"scroll_depth":25.8,"mouse_movement":94.3,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":1,"time_since_last_click":141.76,"device_ip_reputation":0.77,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":10.6,"demo_record":1},{"click_id":"CG-0230","ip_address":"32.141.204.91","timestamp":"2026-10-16 08:00:00","device":"Desktop","click_duration":26.44,"scroll_depth":55.4,"mouse_movement":60.5,"keystrokes_detected":0,"ad_position":"Top","click_frequency":5,"time_since_last_click":53.36,"device_ip_reputation":0.92,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":23.8,"demo_record":1},{"click_id":"CG-0231","ip_address":"113.2.133.45","timestamp":"2026-10-16 11:19:00","device":"Desktop","click_duration":17.25,"scroll_depth":33.0,"mouse_movement":59.3,"keystrokes_detected":1,"ad_position":"Top","click_frequency":7,"time_since_last_click":93.85,"device_ip_reputation":0.66,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":36.8,"demo_record":1},{"click_id":"CG-0232","ip_address":"72.173.234.175","timestamp":"2026-10-16 17:36:00","device":"Desktop","click_duration":19.13,"scroll_depth":69.0,"mouse_movement":57.5,"keystrokes_detected":1,"ad_position":"Top","click_frequency":4,"time_since_last_click":115.16,"device_ip_reputation":0.99,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":36.4,"demo_record":1},{"click_id":"CG-0233","ip_address":"189.134.127.74","timestamp":"2026-10-16 16:48:00","device":"Mobile","click_duration":6.26,"scroll_depth":75.5,"mouse_movement":24.2,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":3,"time_since_last_click":65.58,"device_ip_reputation":0.94,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":28.5,"demo_record":1},{"click_id":"CG-0234","ip_address":"77.105.117.52","timestamp":"2026-10-16 12:00:00","device":"Mobile","click_duration":32.22,"scroll_depth":87.7,"mouse_movement":30.8,"keystrokes_detected":0,"ad_position":"Top","click_frequency":1,"time_since_last_click":122.62,"device_ip_reputation":0.84,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":15.4,"demo_record":1},{"click_id":"CG-0235","ip_address":"157.140.251.47","timestamp":"2026-10-16 13:22:00","device":"Mobile","click_duration":37.45,"scroll_depth":93.7,"mouse_movement":50.6,"keystrokes_detected":1,"ad_position":"Top","click_frequency":5,"time_since_last_click":144.47,"device_ip_reputation":0.76,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":18.5,"demo_record":1},{"click_id":"CG-0236","ip_address":"127.161.4.4","timestamp":"2026-10-16 10:03:00","device":"Desktop","click_duration":26.59,"scroll_depth":53.5,"mouse_movement":44.7,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":5,"time_since_last_click":49.52,"device_ip_reputation":0.67,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":17.3,"demo_record":1},{"click_id":"CG-0237","ip_address":"105.186.205.72","timestamp":"2026-10-16 15:09:00","device":"Tablet","click_duration":18.78,"scroll_depth":67.9,"mouse_movement":74.3,"keystrokes_detected":0,"ad_position":"Feed","click_frequency":7,"time_since_last_click":44.74,"device_ip_reputation":0.74,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":31.0,"demo_record":1},{"click_id":"CG-0238","ip_address":"44.161.249.77","timestamp":"2026-10-16 11:00:00","device":"Desktop","click_duration":11.78,"scroll_depth":89.4,"mouse_movement":50.7,"keystrokes_detected":1,"ad_position":"Top","click_frequency":2,"time_since_last_click":147.05,"device_ip_reputation":0.76,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":15.0,"demo_record":1},{"click_id":"CG-0239","ip_address":"217.131.176.6","timestamp":"2026-10-16 17:33:00","device":"Tablet","click_duration":17.41,"scroll_depth":51.3,"mouse_movement":97.0,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":7,"time_since_last_click":53.38,"device_ip_reputation":0.69,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":15.7,"demo_record":1},{"click_id":"CG-0240","ip_address":"47.85.172.108","timestamp":"2026-10-16 12:53:00","device":"Desktop","click_duration":25.09,"scroll_depth":67.9,"mouse_movement":24.5,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":3,"time_since_last_click":59.09,"device_ip_reputation":0.68,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":30.1,"demo_record":1},{"click_id":"CG-0241","ip_address":"143.230.211.43","timestamp":"2026-10-16 14:11:00","device":"Tablet","click_duration":9.44,"scroll_depth":26.7,"mouse_movement":37.2,"keystrokes_detected":1,"ad_position":"Top","click_frequency":2,"time_since_last_click":32.54,"device_ip_reputation":0.6,"VPN_usage":1,"proxy_usage":0,"browser":"Chrome","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":29.8,"demo_record":1},{"click_id":"CG-0242","ip_address":"31.53.134.159","timestamp":"2026-10-16 16:56:00","device":"Mobile","click_duration":8.43,"scroll_depth":74.1,"mouse_movement":43.4,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":4,"time_since_last_click":113.89,"device_ip_reputation":0.61,"VPN_usage":0,"proxy_usage":1,"browser":"Firefox","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":33.1,"demo_record":1},{"click_id":"CG-0243","ip_address":"148.139.227.35","timestamp":"2026-10-16 15:58:00","device":"Desktop","click_duration":36.93,"scroll_depth":77.3,"mouse_movement":66.4,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":5,"time_since_last_click":116.24,"device_ip_reputation":0.78,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":17.9,"demo_record":1},{"click_id":"CG-0244","ip_address":"49.155.5.1","timestamp":"2026-10-16 14:14:00","device":"Desktop","click_duration":21.32,"scroll_depth":81.9,"mouse_movement":46.2,"keystrokes_detected":1,"ad_position":"Top","click_frequency":6,"time_since_last_click":166.21,"device_ip_reputation":0.97,"VPN_usage":0,"proxy_usage":1,"browser":"Edge","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":23.5,"demo_record":1},{"click_id":"CG-0245","ip_address":"58.210.223.102","timestamp":"2026-10-16 08:07:00","device":"Tablet","click_duration":11.75,"scroll_depth":78.6,"mouse_movement":50.0,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":3,"time_since_last_click":17.02,"device_ip_reputation":0.83,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":25.3,"demo_record":1},{"click_id":"CG-0246","ip_address":"115.96.35.47","timestamp":"2026-10-16 17:04:00","device":"Mobile","click_duration":7.78,"scroll_depth":33.3,"mouse_movement":68.7,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":2,"time_since_last_click":59.75,"device_ip_reputation":0.62,"VPN_usage":0,"proxy_usage":1,"browser":"Chrome","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":11.7,"demo_record":1},{"click_id":"CG-0247","ip_address":"69.46.77.4","timestamp":"2026-10-16 15:28:00","device":"Mobile","click_duration":20.28,"scroll_depth":50.6,"mouse_movement":82.4,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":4,"time_since_last_click":126.36,"device_ip_reputation":0.56,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":11.6,"demo_record":1},{"click_id":"CG-0248","ip_address":"130.92.98.230","timestamp":"2026-10-16 14:41:00","device":"Desktop","click_duration":2.38,"scroll_depth":18.0,"mouse_movement":2.2,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":20,"time_since_last_click":1.95,"device_ip_reputation":0.21,"VPN_usage":0,"proxy_usage":1,"browser":"Edge","operating_system":"Windows","is_fraudulent":1,"classification":"Fraud","risk_score":86.1,"demo_record":1},{"click_id":"CG-0249","ip_address":"184.159.165.41","timestamp":"2026-10-16 11:33:00","device":"Tablet","click_duration":25.02,"scroll_depth":28.2,"mouse_movement":60.7,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":6,"time_since_last_click":55.89,"device_ip_reputation":0.71,"VPN_usage":1,"proxy_usage":0,"browser":"Chrome","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":24.8,"demo_record":1},{"click_id":"CG-0250","ip_address":"213.141.61.102","timestamp":"2026-10-16 13:32:00","device":"Desktop","click_duration":2.24,"scroll_depth":0.2,"mouse_movement":10.5,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":30,"time_since_last_click":1.53,"device_ip_reputation":0.18,"VPN_usage":1,"proxy_usage":1,"browser":"Chrome","operating_system":"Linux","is_fraudulent":1,"classification":"Fraud","risk_score":81.1,"demo_record":1},{"click_id":"CG-0251","ip_address":"101.78.54.33","timestamp":"2026-10-16 18:40:00","device":"Tablet","click_duration":1.44,"scroll_depth":7.0,"mouse_movement":14.2,"keystrokes_detected":0,"ad_position":"Bottom","click_frequency":31,"time_since_last_click":0.56,"device_ip_reputation":0.29,"VPN_usage":1,"proxy_usage":1,"browser":"Chrome","operating_system":"macOS","is_fraudulent":1,"classification":"Fraud","risk_score":91.1,"demo_record":1},{"click_id":"CG-0252","ip_address":"188.250.97.146","timestamp":"2026-10-16 17:32:00","device":"Tablet","click_duration":9.53,"scroll_depth":51.1,"mouse_movement":56.4,"keystrokes_detected":1,"ad_position":"Top","click_frequency":5,"time_since_last_click":30.44,"device_ip_reputation":0.68,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":15.6,"demo_record":1},{"click_id":"CG-0253","ip_address":"168.186.122.83","timestamp":"2026-10-16 11:09:00","device":"Tablet","click_duration":28.24,"scroll_depth":74.4,"mouse_movement":85.2,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":7,"time_since_last_click":100.61,"device_ip_reputation":0.82,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":20.8,"demo_record":1},{"click_id":"CG-0254","ip_address":"43.91.16.52","timestamp":"2026-10-16 09:08:00","device":"Desktop","click_duration":0.43,"scroll_depth":4.2,"mouse_movement":10.3,"keystrokes_detected":0,"ad_position":"Bottom","click_frequency":24,"time_since_last_click":1.6,"device_ip_reputation":0.26,"VPN_usage":1,"proxy_usage":1,"browser":"Chrome","operating_system":"Windows","is_fraudulent":1,"classification":"Fraud","risk_score":97.1,"demo_record":1},{"click_id":"CG-0255","ip_address":"223.40.239.206","timestamp":"2026-10-16 11:33:00","device":"Tablet","click_duration":25.36,"scroll_depth":52.1,"mouse_movement":94.9,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":7,"time_since_last_click":128.39,"device_ip_reputation":0.91,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":4.8,"demo_record":1},{"click_id":"CG-0256","ip_address":"34.51.118.137","timestamp":"2026-10-16 11:41:00","device":"Tablet","click_duration":16.49,"scroll_depth":39.5,"mouse_movement":38.4,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":6,"time_since_last_click":21.68,"device_ip_reputation":0.83,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":8.0,"demo_record":1},{"click_id":"CG-0257","ip_address":"139.172.80.137","timestamp":"2026-10-16 11:04:00","device":"Mobile","click_duration":37.95,"scroll_depth":58.2,"mouse_movement":92.0,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":4,"time_since_last_click":138.26,"device_ip_reputation":0.74,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":29.6,"demo_record":1},{"click_id":"CG-0258","ip_address":"125.229.203.1","timestamp":"2026-10-16 12:20:00","device":"Tablet","click_duration":28.42,"scroll_depth":98.7,"mouse_movement":19.3,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":1,"time_since_last_click":56.16,"device_ip_reputation":0.65,"VPN_usage":0,"proxy_usage":1,"browser":"Firefox","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":20.4,"demo_record":1},{"click_id":"CG-0259","ip_address":"49.48.19.118","timestamp":"2026-10-16 17:44:00","device":"Mobile","click_duration":15.45,"scroll_depth":35.4,"mouse_movement":90.9,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":3,"time_since_last_click":146.56,"device_ip_reputation":0.59,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":30.5,"demo_record":1},{"click_id":"CG-0260","ip_address":"186.48.153.10","timestamp":"2026-10-16 10:57:00","device":"Desktop","click_duration":28.58,"scroll_depth":68.2,"mouse_movement":82.0,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":7,"time_since_last_click":79.87,"device_ip_reputation":0.96,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":3.9,"demo_record":1},{"click_id":"CG-0261","ip_address":"148.76.167.129","timestamp":"2026-10-16 16:56:00","device":"Tablet","click_duration":2.0,"scroll_depth":3.4,"mouse_movement":13.2,"keystrokes_detected":0,"ad_position":"Bottom","click_frequency":32,"time_since_last_click":1.53,"device_ip_reputation":0.23,"VPN_usage":1,"proxy_usage":1,"browser":"Edge","operating_system":"Android","is_fraudulent":1,"classification":"Fraud","risk_score":75.6,"demo_record":1},{"click_id":"CG-0262","ip_address":"200.25.204.68","timestamp":"2026-10-16 09:24:00","device":"Tablet","click_duration":5.98,"scroll_depth":62.6,"mouse_movement":28.7,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":5,"time_since_last_click":38.07,"device_ip_reputation":0.72,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":4.6,"demo_record":1},{"click_id":"CG-0263","ip_address":"157.45.57.172","timestamp":"2026-10-16 15:20:00","device":"Desktop","click_duration":17.48,"scroll_depth":52.4,"mouse_movement":44.3,"keystrokes_detected":0,"ad_position":"Feed","click_frequency":2,"time_since_last_click":177.81,"device_ip_reputation":0.82,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":3.6,"demo_record":1},{"click_id":"CG-0264","ip_address":"105.79.43.29","timestamp":"2026-10-16 11:59:00","device":"Tablet","click_duration":2.11,"scroll_depth":5.3,"mouse_movement":16.7,"keystrokes_detected":0,"ad_position":"Top","click_frequency":18,"time_since_last_click":1.77,"device_ip_reputation":0.09,"VPN_usage":1,"proxy_usage":1,"browser":"Safari","operating_system":"Linux","is_fraudulent":1,"classification":"Fraud","risk_score":77.7,"demo_record":1},{"click_id":"CG-0265","ip_address":"76.247.72.178","timestamp":"2026-10-16 17:19:00","device":"Tablet","click_duration":27.46,"scroll_depth":26.4,"mouse_movement":92.3,"keystrokes_detected":0,"ad_position":"Feed","click_frequency":2,"time_since_last_click":13.64,"device_ip_reputation":0.64,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":4.4,"demo_record":1},{"click_id":"CG-0266","ip_address":"178.184.55.5","timestamp":"2026-10-16 19:16:00","device":"Mobile","click_duration":13.24,"scroll_depth":91.3,"mouse_movement":37.0,"keystrokes_detected":1,"ad_position":"Top","click_frequency":3,"time_since_last_click":88.79,"device_ip_reputation":0.81,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":35.3,"demo_record":1},{"click_id":"CG-0267","ip_address":"145.156.170.126","timestamp":"2026-10-16 08:22:00","device":"Mobile","click_duration":1.19,"scroll_depth":3.5,"mouse_movement":12.3,"keystrokes_detected":0,"ad_position":"Feed","click_frequency":15,"time_since_last_click":2.49,"device_ip_reputation":0.39,"VPN_usage":1,"proxy_usage":1,"browser":"Firefox","operating_system":"macOS","is_fraudulent":1,"classification":"Fraud","risk_score":96.0,"demo_record":1},{"click_id":"CG-0268","ip_address":"81.115.77.88","timestamp":"2026-10-16 08:30:00","device":"Desktop","click_duration":34.4,"scroll_depth":74.3,"mouse_movement":77.9,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":2,"time_since_last_click":104.4,"device_ip_reputation":0.74,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":6.7,"demo_record":1},{"click_id":"CG-0269","ip_address":"148.103.70.80","timestamp":"2026-10-16 19:08:00","device":"Desktop","click_duration":1.97,"scroll_depth":19.8,"mouse_movement":7.7,"keystrokes_detected":0,"ad_position":"Sidebar","click_frequency":18,"time_since_last_click":0.26,"device_ip_reputation":0.24,"VPN_usage":0,"proxy_usage":1,"browser":"Safari","operating_system":"Windows","is_fraudulent":1,"classification":"Fraud","risk_score":92.7,"demo_record":1},{"click_id":"CG-0270","ip_address":"87.226.140.39","timestamp":"2026-10-16 15:03:00","device":"Desktop","click_duration":30.27,"scroll_depth":33.0,"mouse_movement":20.1,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":5,"time_since_last_click":44.1,"device_ip_reputation":0.85,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":20.1,"demo_record":1},{"click_id":"CG-0271","ip_address":"176.191.94.219","timestamp":"2026-10-16 18:19:00","device":"Desktop","click_duration":16.56,"scroll_depth":60.5,"mouse_movement":33.8,"keystrokes_detected":0,"ad_position":"Bottom","click_frequency":7,"time_since_last_click":174.48,"device_ip_reputation":0.96,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":4.4,"demo_record":1},{"click_id":"CG-0272","ip_address":"135.166.234.228","timestamp":"2026-10-16 15:29:00","device":"Desktop","click_duration":11.64,"scroll_depth":55.4,"mouse_movement":67.9,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":4,"time_since_last_click":111.24,"device_ip_reputation":0.88,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":5.9,"demo_record":1},{"click_id":"CG-0273","ip_address":"20.125.202.252","timestamp":"2026-10-16 15:47:00","device":"Tablet","click_duration":28.73,"scroll_depth":66.8,"mouse_movement":80.7,"keystrokes_detected":0,"ad_position":"Sidebar","click_frequency":3,"time_since_last_click":80.8,"device_ip_reputation":0.94,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":12.6,"demo_record":1},{"click_id":"CG-0274","ip_address":"46.237.231.24","timestamp":"2026-10-16 08:55:00","device":"Tablet","click_duration":28.29,"scroll_depth":33.5,"mouse_movement":94.9,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":4,"time_since_last_click":60.25,"device_ip_reputation":0.56,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":5.2,"demo_record":1},{"click_id":"CG-0275","ip_address":"192.83.63.24","timestamp":"2026-10-16 13:31:00","device":"Mobile","click_duration":7.0,"scroll_depth":58.7,"mouse_movement":25.0,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":4,"time_since_last_click":100.41,"device_ip_reputation":0.57,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":33.3,"demo_record":1},{"click_id":"CG-0276","ip_address":"23.214.157.80","timestamp":"2026-10-16 11:03:00","device":"Mobile","click_duration":28.56,"scroll_depth":97.1,"mouse_movement":69.4,"keystrokes_detected":0,"ad_position":"Sidebar","click_frequency":2,"time_since_last_click":3.63,"device_ip_reputation":0.89,"VPN_usage":1,"proxy_usage":0,"browser":"Edge","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":31.1,"demo_record":1},{"click_id":"CG-0277","ip_address":"70.111.243.117","timestamp":"2026-10-16 18:22:00","device":"Tablet","click_duration":17.36,"scroll_depth":31.0,"mouse_movement":18.5,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":1,"time_since_last_click":35.72,"device_ip_reputation":0.57,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":32.2,"demo_record":1},{"click_id":"CG-0278","ip_address":"32.25.55.107","timestamp":"2026-10-16 13:05:00","device":"Mobile","click_duration":37.78,"scroll_depth":37.1,"mouse_movement":68.1,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":6,"time_since_last_click":105.48,"device_ip_reputation":0.96,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":31.5,"demo_record":1},{"click_id":"CG-0279","ip_address":"26.149.241.35","timestamp":"2026-10-16 15:17:00","device":"Mobile","click_duration":7.27,"scroll_depth":89.5,"mouse_movement":61.2,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":5,"time_since_last_click":13.3,"device_ip_reputation":0.8,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":28.1,"demo_record":1},{"click_id":"CG-0280","ip_address":"190.147.218.156","timestamp":"2026-10-16 18:19:00","device":"Tablet","click_duration":32.67,"scroll_depth":44.5,"mouse_movement":99.6,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":5,"time_since_last_click":102.59,"device_ip_reputation":0.78,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":10.4,"demo_record":1},{"click_id":"CG-0281","ip_address":"10.60.12.120","timestamp":"2026-10-16 12:57:00","device":"Desktop","click_duration":24.89,"scroll_depth":33.8,"mouse_movement":83.6,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":1,"time_since_last_click":62.08,"device_ip_reputation":0.8,"VPN_usage":0,"proxy_usage":1,"browser":"Safari","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":11.2,"demo_record":1},{"click_id":"CG-0282","ip_address":"139.165.3.30","timestamp":"2026-10-16 09:09:00","device":"Tablet","click_duration":27.0,"scroll_depth":50.6,"mouse_movement":64.7,"keystrokes_detected":0,"ad_position":"Sidebar","click_frequency":2,"time_since_last_click":61.5,"device_ip_reputation":0.7,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":19.3,"demo_record":1},{"click_id":"CG-0283","ip_address":"147.171.236.201","timestamp":"2026-10-16 18:42:00","device":"Desktop","click_duration":31.5,"scroll_depth":94.6,"mouse_movement":86.5,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":5,"time_since_last_click":97.85,"device_ip_reputation":0.64,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":36.9,"demo_record":1},{"click_id":"CG-0284","ip_address":"96.192.84.147","timestamp":"2026-10-16 12:47:00","device":"Desktop","click_duration":24.2,"scroll_depth":39.1,"mouse_movement":88.9,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":6,"time_since_last_click":8.6,"device_ip_reputation":0.73,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":9.8,"demo_record":1},{"click_id":"CG-0285","ip_address":"105.19.103.234","timestamp":"2026-10-16 13:09:00","device":"Mobile","click_duration":0.4,"scroll_depth":11.1,"mouse_movement":16.3,"keystrokes_detected":0,"ad_position":"Sidebar","click_frequency":18,"time_since_last_click":2.32,"device_ip_reputation":0.31,"VPN_usage":1,"proxy_usage":0,"browser":"Safari","operating_system":"Windows","is_fraudulent":1,"classification":"Fraud","risk_score":94.2,"demo_record":1},{"click_id":"CG-0286","ip_address":"43.105.18.118","timestamp":"2026-10-16 16:48:00","device":"Desktop","click_duration":16.57,"scroll_depth":89.9,"mouse_movement":18.3,"keystrokes_detected":0,"ad_position":"Top","click_frequency":3,"time_since_last_click":85.64,"device_ip_reputation":0.57,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":22.8,"demo_record":1},{"click_id":"CG-0287","ip_address":"63.164.102.50","timestamp":"2026-10-16 13:19:00","device":"Mobile","click_duration":13.03,"scroll_depth":64.9,"mouse_movement":73.0,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":2,"time_since_last_click":51.43,"device_ip_reputation":0.56,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":14.6,"demo_record":1},{"click_id":"CG-0288","ip_address":"190.145.125.44","timestamp":"2026-10-16 13:26:00","device":"Mobile","click_duration":5.49,"scroll_depth":71.0,"mouse_movement":62.3,"keystrokes_detected":0,"ad_position":"Sidebar","click_frequency":1,"time_since_last_click":86.32,"device_ip_reputation":0.85,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":8.4,"demo_record":1},{"click_id":"CG-0289","ip_address":"171.228.182.80","timestamp":"2026-10-16 18:10:00","device":"Tablet","click_duration":14.63,"scroll_depth":39.9,"mouse_movement":84.4,"keystrokes_detected":0,"ad_position":"Bottom","click_frequency":5,"time_since_last_click":26.33,"device_ip_reputation":0.91,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":26.6,"demo_record":1},{"click_id":"CG-0290","ip_address":"67.73.132.234","timestamp":"2026-10-16 15:56:00","device":"Tablet","click_duration":15.72,"scroll_depth":38.8,"mouse_movement":45.1,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":4,"time_since_last_click":8.36,"device_ip_reputation":0.76,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":29.6,"demo_record":1},{"click_id":"CG-0291","ip_address":"140.52.207.210","timestamp":"2026-10-16 18:18:00","device":"Tablet","click_duration":28.0,"scroll_depth":33.0,"mouse_movement":71.3,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":4,"time_since_last_click":107.52,"device_ip_reputation":0.65,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":4.4,"demo_record":1},{"click_id":"CG-0292","ip_address":"161.220.222.146","timestamp":"2026-10-16 11:33:00","device":"Desktop","click_duration":30.56,"scroll_depth":65.8,"mouse_movement":32.2,"keystrokes_detected":0,"ad_position":"Bottom","click_frequency":1,"time_since_last_click":107.81,"device_ip_reputation":0.75,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":36.4,"demo_record":1},{"click_id":"CG-0293","ip_address":"185.194.167.127","timestamp":"2026-10-16 09:11:00","device":"Desktop","click_duration":25.57,"scroll_depth":29.6,"mouse_movement":85.0,"keystrokes_detected":0,"ad_position":"Sidebar","click_frequency":6,"time_since_last_click":29.41,"device_ip_reputation":0.78,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":26.5,"demo_record":1},{"click_id":"CG-0294","ip_address":"213.155.222.184","timestamp":"2026-10-16 13:24:00","device":"Desktop","click_duration":37.39,"scroll_depth":50.8,"mouse_movement":65.8,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":7,"time_since_last_click":55.07,"device_ip_reputation":0.71,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":33.0,"demo_record":1},{"click_id":"CG-0295","ip_address":"189.201.162.183","timestamp":"2026-10-16 08:31:00","device":"Tablet","click_duration":16.4,"scroll_depth":53.6,"mouse_movement":35.3,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":2,"time_since_last_click":36.32,"device_ip_reputation":0.72,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":37.9,"demo_record":1},{"click_id":"CG-0296","ip_address":"12.36.8.37","timestamp":"2026-10-16 19:26:00","device":"Mobile","click_duration":2.06,"scroll_depth":10.7,"mouse_movement":17.5,"keystrokes_detected":0,"ad_position":"Top","click_frequency":12,"time_since_last_click":1.64,"device_ip_reputation":0.2,"VPN_usage":1,"proxy_usage":0,"browser":"Edge","operating_system":"Linux","is_fraudulent":1,"classification":"Fraud","risk_score":76.9,"demo_record":1},{"click_id":"CG-0297","ip_address":"219.230.196.91","timestamp":"2026-10-16 16:41:00","device":"Desktop","click_duration":10.9,"scroll_depth":56.9,"mouse_movement":65.4,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":4,"time_since_last_click":167.0,"device_ip_reputation":0.8,"VPN_usage":1,"proxy_usage":1,"browser":"Edge","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":6.1,"demo_record":1},{"click_id":"CG-0298","ip_address":"30.72.143.120","timestamp":"2026-10-16 16:13:00","device":"Tablet","click_duration":21.09,"scroll_depth":64.3,"mouse_movement":25.3,"keystrokes_detected":1,"ad_position":"Top","click_frequency":6,"time_since_last_click":115.16,"device_ip_reputation":0.9,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":30.0,"demo_record":1},{"click_id":"CG-0299","ip_address":"130.169.215.91","timestamp":"2026-10-16 16:00:00","device":"Mobile","click_duration":36.62,"scroll_depth":84.9,"mouse_movement":31.7,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":1,"time_since_last_click":114.39,"device_ip_reputation":0.8,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":3.0,"demo_record":1},{"click_id":"CG-0300","ip_address":"139.39.142.65","timestamp":"2026-10-16 16:16:00","device":"Mobile","click_duration":0.5,"scroll_depth":6.2,"mouse_movement":0.3,"keystrokes_detected":0,"ad_position":"Sidebar","click_frequency":26,"time_since_last_click":1.87,"device_ip_reputation":0.28,"VPN_usage":1,"proxy_usage":1,"browser":"Safari","operating_system":"macOS","is_fraudulent":1,"classification":"Fraud","risk_score":76.9,"demo_record":1},{"click_id":"CG-0301","ip_address":"97.43.74.153","timestamp":"2026-10-16 17:00:00","device":"Mobile","click_duration":35.69,"scroll_depth":36.6,"mouse_movement":79.7,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":2,"time_since_last_click":119.94,"device_ip_reputation":0.87,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":25.1,"demo_record":1},{"click_id":"CG-0302","ip_address":"128.204.243.78","timestamp":"2026-10-16 09:58:00","device":"Tablet","click_duration":1.41,"scroll_depth":20.9,"mouse_movement":4.2,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":23,"time_since_last_click":0.73,"device_ip_reputation":0.24,"VPN_usage":1,"proxy_usage":1,"browser":"Edge","operating_system":"macOS","is_fraudulent":1,"classification":"Fraud","risk_score":90.3,"demo_record":1},{"click_id":"CG-0303","ip_address":"20.49.181.245","timestamp":"2026-10-16 17:02:00","device":"Tablet","click_duration":32.55,"scroll_depth":70.8,"mouse_movement":88.4,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":3,"time_since_last_click":145.01,"device_ip_reputation":0.66,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":29.7,"demo_record":1},{"click_id":"CG-0304","ip_address":"186.92.160.141","timestamp":"2026-10-16 16:52:00","device":"Desktop","click_duration":3.37,"scroll_depth":25.6,"mouse_movement":19.0,"keystrokes_detected":0,"ad_position":"Top","click_frequency":6,"time_since_last_click":81.93,"device_ip_reputation":0.65,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":5.3,"demo_record":1},{"click_id":"CG-0305","ip_address":"223.111.62.182","timestamp":"2026-10-16 18:08:00","device":"Tablet","click_duration":36.52,"scroll_depth":31.5,"mouse_movement":28.7,"keystrokes_detected":1,"ad_position":"Top","click_frequency":6,"time_since_last_click":35.61,"device_ip_reputation":0.68,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":29.7,"demo_record":1},{"click_id":"CG-0306","ip_address":"207.165.131.42","timestamp":"2026-10-16 19:48:00","device":"Desktop","click_duration":30.33,"scroll_depth":45.8,"mouse_movement":49.4,"keystrokes_detected":1,"ad_position":"Top","click_frequency":3,"time_since_last_click":172.14,"device_ip_reputation":0.67,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":16.1,"demo_record":1},{"click_id":"CG-0307","ip_address":"46.220.111.158","timestamp":"2026-10-16 19:00:00","device":"Tablet","click_duration":25.52,"scroll_depth":93.4,"mouse_movement":39.2,"keystrokes_detected":0,"ad_position":"Top","click_frequency":1,"time_since_last_click":104.13,"device_ip_reputation":0.66,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":35.6,"demo_record":1},{"click_id":"CG-0308","ip_address":"48.168.200.148","timestamp":"2026-10-16 19:20:00","device":"Mobile","click_duration":3.13,"scroll_depth":78.1,"mouse_movement":57.2,"keystrokes_detected":1,"ad_position":"Top","click_frequency":5,"time_since_last_click":42.97,"device_ip_reputation":0.72,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":21.3,"demo_record":1},{"click_id":"CG-0309","ip_address":"87.205.28.162","timestamp":"2026-10-16 14:07:00","device":"Mobile","click_duration":37.9,"scroll_depth":73.5,"mouse_movement":61.8,"keystrokes_detected":1,"ad_position":"Top","click_frequency":7,"time_since_last_click":84.36,"device_ip_reputation":0.89,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":25.8,"demo_record":1},{"click_id":"CG-0310","ip_address":"37.183.249.22","timestamp":"2026-10-16 13:06:00","device":"Desktop","click_duration":33.98,"scroll_depth":57.8,"mouse_movement":29.5,"keystrokes_detected":1,"ad_position":"Top","click_frequency":6,"time_since_last_click":179.36,"device_ip_reputation":0.65,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":21.2,"demo_record":1},{"click_id":"CG-0311","ip_address":"14.18.173.15","timestamp":"2026-10-16 15:40:00","device":"Mobile","click_duration":14.82,"scroll_depth":79.1,"mouse_movement":27.7,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":6,"time_since_last_click":105.54,"device_ip_reputation":0.96,"VPN_usage":1,"proxy_usage":0,"browser":"Chrome","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":34.7,"demo_record":1},{"click_id":"CG-0312","ip_address":"189.66.7.45","timestamp":"2026-10-16 18:33:00","device":"Desktop","click_duration":1.83,"scroll_depth":19.9,"mouse_movement":8.2,"keystrokes_detected":0,"ad_position":"Top","click_frequency":34,"time_since_last_click":2.06,"device_ip_reputation":0.09,"VPN_usage":1,"proxy_usage":0,"browser":"Chrome","operating_system":"Android","is_fraudulent":1,"classification":"Fraud","risk_score":83.5,"demo_record":1},{"click_id":"CG-0313","ip_address":"40.70.164.215","timestamp":"2026-10-16 19:34:00","device":"Desktop","click_duration":36.76,"scroll_depth":41.0,"mouse_movement":66.6,"keystrokes_detected":1,"ad_position":"Top","click_frequency":1,"time_since_last_click":51.48,"device_ip_reputation":0.88,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":10.8,"demo_record":1},{"click_id":"CG-0314","ip_address":"35.192.80.5","timestamp":"2026-10-16 17:55:00","device":"Desktop","click_duration":2.48,"scroll_depth":1.8,"mouse_movement":3.2,"keystrokes_detected":0,"ad_position":"Feed","click_frequency":21,"time_since_last_click":1.76,"device_ip_reputation":0.33,"VPN_usage":1,"proxy_usage":1,"browser":"Safari","operating_system":"iOS","is_fraudulent":1,"classification":"Fraud","risk_score":86.1,"demo_record":1},{"click_id":"CG-0315","ip_address":"54.19.92.184","timestamp":"2026-10-16 15:01:00","device":"Tablet","click_duration":20.5,"scroll_depth":96.3,"mouse_movement":85.8,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":4,"time_since_last_click":3.81,"device_ip_reputation":0.65,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":15.0,"demo_record":1},{"click_id":"CG-0316","ip_address":"128.106.141.14","timestamp":"2026-10-16 17:12:00","device":"Tablet","click_duration":9.78,"scroll_depth":84.7,"mouse_movement":87.2,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":2,"time_since_last_click":31.28,"device_ip_reputation":0.96,"VPN_usage":1,"proxy_usage":0,"browser":"Safari","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":11.0,"demo_record":1},{"click_id":"CG-0317","ip_address":"204.232.22.27","timestamp":"2026-10-16 18:31:00","device":"Desktop","click_duration":28.91,"scroll_depth":94.4,"mouse_movement":31.0,"keystrokes_detected":0,"ad_position":"Bottom","click_frequency":5,"time_since_last_click":23.54,"device_ip_reputation":0.94,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":9.2,"demo_record":1},{"click_id":"CG-0318","ip_address":"68.56.166.59","timestamp":"2026-10-16 19:33:00","device":"Desktop","click_duration":6.43,"scroll_depth":80.3,"mouse_movement":48.8,"keystrokes_detected":1,"ad_position":"Top","click_frequency":4,"time_since_last_click":106.56,"device_ip_reputation":0.57,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":15.9,"demo_record":1},{"click_id":"CG-0319","ip_address":"59.183.138.52","timestamp":"2026-10-16 10:19:00","device":"Tablet","click_duration":14.76,"scroll_depth":27.4,"mouse_movement":22.9,"keystrokes_detected":1,"ad_position":"Top","click_frequency":7,"time_since_last_click":85.4,"device_ip_reputation":0.73,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":7.6,"demo_record":1},{"click_id":"CG-0320","ip_address":"53.117.44.106","timestamp":"2026-10-16 18:53:00","device":"Desktop","click_duration":32.99,"scroll_depth":61.7,"mouse_movement":66.5,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":1,"time_since_last_click":132.21,"device_ip_reputation":0.87,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":36.1,"demo_record":1},{"click_id":"CG-0321","ip_address":"116.22.20.254","timestamp":"2026-10-16 17:47:00","device":"Desktop","click_duration":19.47,"scroll_depth":82.6,"mouse_movement":52.9,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":7,"time_since_last_click":144.25,"device_ip_reputation":0.91,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":36.2,"demo_record":1},{"click_id":"CG-0322","ip_address":"71.46.8.123","timestamp":"2026-10-16 10:15:00","device":"Mobile","click_duration":26.42,"scroll_depth":37.1,"mouse_movement":88.3,"keystrokes_detected":0,"ad_position":"Bottom","click_frequency":4,"time_since_last_click":139.61,"device_ip_reputation":0.93,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":27.3,"demo_record":1},{"click_id":"CG-0323","ip_address":"28.197.170.136","timestamp":"2026-10-16 08:01:00","device":"Mobile","click_duration":4.14,"scroll_depth":56.9,"mouse_movement":75.2,"keystrokes_detected":1,"ad_position":"Top","click_frequency":5,"time_since_last_click":158.91,"device_ip_reputation":0.87,"VPN_usage":1,"proxy_usage":0,"browser":"Firefox","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":6.0,"demo_record":1},{"click_id":"CG-0324","ip_address":"20.187.187.45","timestamp":"2026-10-16 14:14:00","device":"Tablet","click_duration":25.69,"scroll_depth":77.9,"mouse_movement":76.2,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":3,"time_since_last_click":45.24,"device_ip_reputation":0.6,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":13.5,"demo_record":1},{"click_id":"CG-0325","ip_address":"118.141.27.17","timestamp":"2026-10-16 12:33:00","device":"Tablet","click_duration":16.05,"scroll_depth":58.9,"mouse_movement":61.2,"keystrokes_detected":0,"ad_position":"Bottom","click_frequency":6,"time_since_last_click":97.15,"device_ip_reputation":0.91,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":8.8,"demo_record":1},{"click_id":"CG-0326","ip_address":"110.91.147.246","timestamp":"2026-10-16 15:48:00","device":"Mobile","click_duration":2.69,"scroll_depth":2.4,"mouse_movement":2.0,"keystrokes_detected":0,"ad_position":"Bottom","click_frequency":12,"time_since_last_click":2.2,"device_ip_reputation":0.23,"VPN_usage":0,"proxy_usage":1,"browser":"Safari","operating_system":"macOS","is_fraudulent":1,"classification":"Fraud","risk_score":81.4,"demo_record":1},{"click_id":"CG-0327","ip_address":"15.149.96.17","timestamp":"2026-10-16 15:34:00","device":"Tablet","click_duration":3.77,"scroll_depth":85.1,"mouse_movement":70.9,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":6,"time_since_last_click":117.35,"device_ip_reputation":0.69,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":12.9,"demo_record":1},{"click_id":"CG-0328","ip_address":"88.87.133.59","timestamp":"2026-10-16 10:15:00","device":"Desktop","click_duration":19.95,"scroll_depth":97.8,"mouse_movement":30.2,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":2,"time_since_last_click":112.5,"device_ip_reputation":0.62,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":7.8,"demo_record":1},{"click_id":"CG-0329","ip_address":"91.64.225.67","timestamp":"2026-10-16 09:59:00","device":"Tablet","click_duration":1.13,"scroll_depth":4.5,"mouse_movement":0.6,"keystrokes_detected":0,"ad_position":"Feed","click_frequency":12,"time_since_last_click":0.99,"device_ip_reputation":0.24,"VPN_usage":1,"proxy_usage":1,"browser":"Chrome","operating_system":"macOS","is_fraudulent":1,"classification":"Fraud","risk_score":97.1,"demo_record":1},{"click_id":"CG-0330","ip_address":"91.79.2.249","timestamp":"2026-10-16 10:28:00","device":"Mobile","click_duration":28.85,"scroll_depth":98.2,"mouse_movement":71.1,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":3,"time_since_last_click":174.62,"device_ip_reputation":0.88,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":26.8,"demo_record":1},{"click_id":"CG-0331","ip_address":"45.59.157.7","timestamp":"2026-10-16 16:10:00","device":"Mobile","click_duration":17.06,"scroll_depth":88.1,"mouse_movement":47.3,"keystrokes_detected":1,"ad_position":"Top","click_frequency":5,"time_since_last_click":116.51,"device_ip_reputation":0.81,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":2.8,"demo_record":1},{"click_id":"CG-0332","ip_address":"183.44.201.50","timestamp":"2026-10-16 17:11:00","device":"Tablet","click_duration":20.17,"scroll_depth":70.2,"mouse_movement":95.4,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":2,"time_since_last_click":129.73,"device_ip_reputation":0.74,"VPN_usage":0,"proxy_usage":1,"browser":"Firefox","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":13.1,"demo_record":1},{"click_id":"CG-0333","ip_address":"32.110.227.190","timestamp":"2026-10-16 15:36:00","device":"Mobile","click_duration":37.74,"scroll_depth":85.3,"mouse_movement":31.4,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":2,"time_since_last_click":150.89,"device_ip_reputation":0.81,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":35.6,"demo_record":1},{"click_id":"CG-0334","ip_address":"32.3.209.164","timestamp":"2026-10-16 18:04:00","device":"Tablet","click_duration":35.0,"scroll_depth":56.1,"mouse_movement":55.9,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":2,"time_since_last_click":150.31,"device_ip_reputation":0.68,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":12.9,"demo_record":1},{"click_id":"CG-0335","ip_address":"67.13.1.40","timestamp":"2026-10-16 17:32:00","device":"Tablet","click_duration":12.19,"scroll_depth":96.7,"mouse_movement":56.7,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":2,"time_since_last_click":90.06,"device_ip_reputation":0.85,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":37.8,"demo_record":1},{"click_id":"CG-0336","ip_address":"102.246.223.223","timestamp":"2026-10-16 09:08:00","device":"Tablet","click_duration":12.03,"scroll_depth":76.4,"mouse_movement":85.1,"keystrokes_detected":1,"ad_position":"Top","click_frequency":7,"time_since_last_click":48.94,"device_ip_reputation":0.81,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":7.9,"demo_record":1},{"click_id":"CG-0337","ip_address":"172.182.24.75","timestamp":"2026-10-16 12:39:00","device":"Desktop","click_duration":13.21,"scroll_depth":72.9,"mouse_movement":60.1,"keystrokes_detected":1,"ad_position":"Top","click_frequency":5,"time_since_last_click":136.22,"device_ip_reputation":0.79,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":26.7,"demo_record":1},{"click_id":"CG-0338","ip_address":"146.180.73.4","timestamp":"2026-10-16 19:44:00","device":"Mobile","click_duration":7.79,"scroll_depth":46.1,"mouse_movement":51.8,"keystrokes_detected":1,"ad_position":"Top","click_frequency":2,"time_since_last_click":30.36,"device_ip_reputation":0.65,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":18.6,"demo_record":1},{"click_id":"CG-0339","ip_address":"43.8.245.90","timestamp":"2026-10-16 09:18:00","device":"Mobile","click_duration":0.98,"scroll_depth":8.0,"mouse_movement":16.0,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":13,"time_since_last_click":1.8,"device_ip_reputation":0.06,"VPN_usage":0,"proxy_usage":1,"browser":"Safari","operating_system":"Android","is_fraudulent":1,"classification":"Fraud","risk_score":80.3,"demo_record":1},{"click_id":"CG-0340","ip_address":"30.217.57.20","timestamp":"2026-10-16 11:34:00","device":"Mobile","click_duration":0.2,"scroll_depth":10.7,"mouse_movement":0.8,"keystrokes_detected":0,"ad_position":"Top","click_frequency":33,"time_since_last_click":1.68,"device_ip_reputation":0.26,"VPN_usage":1,"proxy_usage":0,"browser":"Chrome","operating_system":"Windows","is_fraudulent":1,"classification":"Fraud","risk_score":80.1,"demo_record":1},{"click_id":"CG-0341","ip_address":"210.63.105.151","timestamp":"2026-10-16 08:10:00","device":"Mobile","click_duration":34.54,"scroll_depth":38.9,"mouse_movement":20.4,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":5,"time_since_last_click":64.57,"device_ip_reputation":0.62,"VPN_usage":0,"proxy_usage":0,"browser":"Safari","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":22.5,"demo_record":1},{"click_id":"CG-0342","ip_address":"205.7.111.184","timestamp":"2026-10-16 09:41:00","device":"Tablet","click_duration":9.7,"scroll_depth":46.1,"mouse_movement":18.4,"keystrokes_detected":0,"ad_position":"Sidebar","click_frequency":5,"time_since_last_click":153.68,"device_ip_reputation":0.76,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"Android","is_fraudulent":0,"classification":"Valid","risk_score":32.1,"demo_record":1},{"click_id":"CG-0343","ip_address":"141.116.208.29","timestamp":"2026-10-16 14:28:00","device":"Mobile","click_duration":29.65,"scroll_depth":48.6,"mouse_movement":27.0,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":7,"time_since_last_click":66.94,"device_ip_reputation":0.68,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":15.9,"demo_record":1},{"click_id":"CG-0344","ip_address":"89.227.115.142","timestamp":"2026-10-16 15:47:00","device":"Mobile","click_duration":17.25,"scroll_depth":98.9,"mouse_movement":33.5,"keystrokes_detected":0,"ad_position":"Bottom","click_frequency":6,"time_since_last_click":68.04,"device_ip_reputation":0.56,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":20.8,"demo_record":1},{"click_id":"CG-0345","ip_address":"46.202.205.178","timestamp":"2026-10-16 19:32:00","device":"Desktop","click_duration":1.71,"scroll_depth":2.2,"mouse_movement":1.2,"keystrokes_detected":0,"ad_position":"Feed","click_frequency":14,"time_since_last_click":1.53,"device_ip_reputation":0.4,"VPN_usage":1,"proxy_usage":0,"browser":"Edge","operating_system":"iOS","is_fraudulent":1,"classification":"Fraud","risk_score":92.7,"demo_record":1},{"click_id":"CG-0346","ip_address":"203.204.182.122","timestamp":"2026-10-16 17:55:00","device":"Mobile","click_duration":26.33,"scroll_depth":96.3,"mouse_movement":59.9,"keystrokes_detected":1,"ad_position":"Bottom","click_frequency":1,"time_since_last_click":24.63,"device_ip_reputation":0.77,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"Windows","is_fraudulent":0,"classification":"Valid","risk_score":28.6,"demo_record":1},{"click_id":"CG-0347","ip_address":"16.91.195.155","timestamp":"2026-10-16 09:09:00","device":"Tablet","click_duration":26.77,"scroll_depth":36.5,"mouse_movement":69.1,"keystrokes_detected":0,"ad_position":"Bottom","click_frequency":7,"time_since_last_click":85.49,"device_ip_reputation":0.68,"VPN_usage":0,"proxy_usage":0,"browser":"Firefox","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":21.7,"demo_record":1},{"click_id":"CG-0348","ip_address":"40.196.230.81","timestamp":"2026-10-16 08:32:00","device":"Desktop","click_duration":32.85,"scroll_depth":58.2,"mouse_movement":20.7,"keystrokes_detected":1,"ad_position":"Sidebar","click_frequency":4,"time_since_last_click":79.23,"device_ip_reputation":0.69,"VPN_usage":0,"proxy_usage":0,"browser":"Edge","operating_system":"Linux","is_fraudulent":0,"classification":"Valid","risk_score":26.7,"demo_record":1},{"click_id":"CG-0349","ip_address":"153.80.28.101","timestamp":"2026-10-16 17:45:00","device":"Mobile","click_duration":12.22,"scroll_depth":69.3,"mouse_movement":68.6,"keystrokes_detected":1,"ad_position":"Feed","click_frequency":3,"time_since_last_click":13.87,"device_ip_reputation":0.81,"VPN_usage":0,"proxy_usage":0,"browser":"Chrome","operating_system":"iOS","is_fraudulent":0,"classification":"Valid","risk_score":15.7,"demo_record":1},{"click_id":"CG-0350","ip_address":"101.210.179.15","timestamp":"2026-10-16 15:18:00","device":"Tablet","click_duration":26.14,"scroll_depth":43.6,"mouse_movement":43.6,"keystrokes_detected":0,"ad_position":"Top","click_frequency":7,"time_since_last_click":56.97,"device_ip_reputation":0.7,"VPN_usage":1,"proxy_usage":0,"browser":"Edge","operating_system":"macOS","is_fraudulent":0,"classification":"Valid","risk_score":22.4,"demo_record":1}];
const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

const navigation = [
  { id: 'overview', label: 'Overview', Icon: LayoutDashboard },
  { id: 'events', label: 'Click events', Icon: MousePointer2 },
  { id: 'fraud', label: 'Fraud monitoring', Icon: ShieldAlert },
  { id: 'blocked', label: 'Blocked IPs', Icon: ShieldCheck }
];

const descriptions = {
  overview:
    'Overview menyajikan ringkasan aktivitas klik iklan dan indikator potensi fraud. Pengguna dapat melihat total event, traffic valid, event fraud, dan fraud rate. Grafik Traffic overview membantu memahami perubahan volume klik berdasarkan waktu. Halaman ini menjadi titik awal untuk menelusuri aktivitas yang perlu diperiksa.',
  events:
    'Click events menampilkan catatan aktivitas klik secara terperinci. Tabel memuat ID klik, alamat IP, perangkat, waktu, klasifikasi, dan risk score. Filter dan pagination membantu pengguna menelusuri seluruh event. Klik salah satu baris untuk melihat detail aktivitas dan indikator pendukung.',
  fraud:
    'Fraud monitoring memusatkan perhatian pada event yang diberi label fraud. Pengguna dapat meninjau IP, waktu aktivitas, perangkat, dan risk score. Detail event membantu memeriksa indikator seperti frekuensi klik, VPN, atau proxy. Klasifikasi perlu ditinjau sebelum dijadikan dasar tindakan.',
  blocked:
    'Blocked IPs menampilkan alamat IP yang memiliki sinyal risiko dalam dataset. Pengguna dapat memeriksa event terkait dan indikator VPN atau proxy. Sinyal risiko tidak berarti IP telah diblokir secara nyata. Status pemblokiran aktual perlu dikonfirmasi melalui backend keamanan.',
  settings:
    'Pengaturan menyediakan informasi konfigurasi dan integrasi ClickGuard. Pengguna dapat memeriksa status koneksi backend. Informasi ini membantu memahami sumber data dan kesiapan integrasi. Konfigurasi lanjutan dapat ditambahkan setelah backend tersedia.'
};

const numberFormat = value => new Intl.NumberFormat('id-ID').format(value);
const percent = value => `${value.toFixed(1).replace('.', ',')}%`;

// Leave VITE_API_URL empty during local development so requests stay same-origin
// and Vite proxies /api to Express. This avoids browser CORS failures on localhost.
function getApiBaseUrl() {
  return String(import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');
}

function getApiEndpoint(path) {
  const base = getApiBaseUrl();
  const normalizedPath = String(path).replace(/^\/+/, '').replace(/^api\//, '');

  // Default development route: Vite proxy handles /api/* -> Express :5000.
  if (!base) return `/api/${normalizedPath}`;

  // Explicit production/deployment URL may be supplied as either host root or host/api.
  return base.endsWith('/api')
    ? `${base}/${normalizedPath}`
    : `${base}/api/${normalizedPath}`;
}

function explainApiError(error, endpointLabel) {
  const message = String(error?.message || error || 'Unknown error');
  if (/failed to fetch|networkerror|fetch failed|load failed/i.test(message)) {
    return `Tidak dapat menjangkau ${endpointLabel}. Mode development memakai proxy Vite /api ke backend. Pastikan Express aktif di http://localhost:5000, GET /health merespons, lalu restart npm run dev setelah mengubah vite.config.js. Detail browser: ${message}`;
  }
  if (/HTTP 502|HTTP 503|HTTP 504/i.test(message)) {
    return `${endpointLabel} tidak tersedia (${message}). Periksa terminal Vite dan pastikan backend Express hidup di http://localhost:5000.`;
  }
  return `${endpointLabel}: ${message}`;
}

function extractEventRows(payload) {
  if (Array.isArray(payload)) return payload;
  const candidates = [
    payload?.data, payload?.data?.events, payload?.events,
    payload?.result?.data, payload?.result?.events, payload?.items,
    payload?.results
  ];
  const rows = candidates.find(Array.isArray);
  if (rows) return rows;

  // This backend returns { data: {}, total: 0, page, limit, totalPages: 0 }
  // when its collection is empty. Treat it as a valid empty API response so
  // the UI can deliberately load the local preview dataset instead of failing
  // schema validation and accidentally displaying zero records.
  if (payload && typeof payload === 'object' &&
      ('total' in payload || 'totalPages' in payload) &&
      payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
    return [];
  }
  return null;
}

function asBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  const text = String(value ?? '').trim().toLowerCase();
  return text === 'true' || text === '1' || text === 'yes' || text === 'ya';
}

function getEventTimestamp(event) {
  const candidates = [
    event?.timestamp, event?.datetime, event?.date, event?.event_timestamp,
    event?.eventTimestamp, event?.event_time, event?.eventTime,
    event?.click_time, event?.clickTime, event?.created_at, event?.createdAt,
    event?.date_time, event?.dateTime, event?.click_date, event?.clickDate,
    event?.time
  ];
  return candidates.find(value => value !== undefined && value !== null && value !== '' && value !== '-') ?? null;
}

function normalizeEvent(event, index) {
  const fraudulent =
    asBoolean(event.is_fraudulent ?? event.isFraudulent) ||
    String(event.classification ?? '').toLowerCase() === 'fraud';

  return {
    ...event,
    click_id: event.click_id ?? event.clickId ?? `CLICK-${index + 1}`,
    ip_address: event.ip_address ?? event.ip ?? '-',
    device: event.device ?? 'Unknown',
    timestamp: getEventTimestamp(event) ?? '-',
    classification: fraudulent ? 'Fraud' : 'Valid',
    is_fraudulent: fraudulent,
    risk_score: Number(event.risk_score ?? event.riskScore ?? (fraudulent ? 75 : 20)),
    browser: event.browser ?? '-',
    operating_system: event.operating_system ?? event.os ?? '-',
    click_duration: event.click_duration ?? '-',
    scroll_depth: event.scroll_depth ?? '-',
    click_frequency: event.click_frequency ?? '-',
    VPN_usage: asBoolean(event.VPN_usage ?? event.vpn_usage),
    proxy_usage: asBoolean(event.proxy_usage ?? event.Proxy_usage)
  };
}

function csvEscape(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

function downloadCsv(filename, rows) {
  const csv = '\uFEFF' + rows.map(row => row.map(csvEscape).join(',')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Sidebar({ active, onNavigate, open, onClose, eventCount }) {
  return (
    <>
      {open && <button className="mobile-scrim" aria-label="Tutup menu" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><Activity size={22} /></div>
          <div><b>ClickGuard</b><small>FRAUD INTELLIGENCE</small></div>
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav>
          {navigation.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`nav-item ${active === id ? 'active' : ''}`}
              onClick={() => { onNavigate(id); onClose(); }}
            >
              <Icon size={18} />
              <span>{label}</span>
              {active === id && <i />}
            </button>
          ))}
        </nav>
        <button
          className={`nav-item settings-item ${active === 'settings' ? 'active' : ''}`}
          onClick={() => { onNavigate('settings'); onClose(); }}
        >
          <Settings size={18} /><span>Pengaturan</span>
        </button>
        <div className="workspace-card">
          <div className="ws-head"><span className="status-dot" />Status dataset</div>
          <p>Dataset lokal dimuat untuk analisis event klik.</p>
          <small>EVENT TERBACA · {numberFormat(eventCount)}</small>
        </div>
        <div className="sidebar-foot">
          SISTEM DETEKSI FRAUD KLIK IKLAN DIGITAL<br />
          Proyek Penelitian · Kelompok 2
        </div>
      </aside>
    </>
  );
}

function Header({ onMenu, onNotifications, notificationOpen, unread }) {
  return (
    <header className="topbar">
      <div className="top-left">
        <button className="icon-button mobile-menu" onClick={onMenu} aria-label="Buka navigasi">
          <Menu size={19} />
        </button>
        <span className="crumb">Workspace <b>/</b> <strong>ClickGuard</strong></span>
      </div>
      <div className="top-actions">
        <button
          className={`icon-button notification ${notificationOpen ? 'pressed' : ''}`}
          onClick={onNotifications}
          aria-label="Notifikasi"
          aria-expanded={notificationOpen}
        >
          <Bell size={18} />
          {unread && <i />}
        </button>
        <div className="profile">
          <div className="avatar">A4</div>
          <div><b>Frontend workspace</b><small>Kelompok 2</small></div>
        </div>
      </div>
    </header>
  );
}

function Tooltip({ children }) {
  const [show, setShow] = useState(false);
  return (
    <span className="tooltip-wrap" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <button
        className="help-trigger"
        aria-label="Keterangan grafik"
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        onClick={() => setShow(value => !value)}
      >
        <CircleHelp size={15} />
      </button>
      {show && <span role="tooltip" className="tooltip-pop">{children}</span>}
    </span>
  );
}

function Metric({ title, value, sub, Icon, tone, delay }) {
  return (
    <article className="metric-card lift" style={{ '--delay': `${delay}ms` }}>
      <div className="metric-top">
        <span>{title}</span>
        <span className={`metric-icon ${tone}`}><Icon size={19} /></span>
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-bottom"><span>{sub}</span><span className="metric-glow" /></div>
    </article>
  );
}

/*
 * Parse timestamps into browser-local Date values so bucket labels match the
 * user's local clock. Date-only strings are parsed as local calendar dates.
 */
function parseTrafficDate(row) {
  const candidates = [
    row?.timestamp, row?.datetime, row?.date,
    row?.event_timestamp, row?.eventTimestamp, row?.event_time, row?.eventTime,
    row?.click_time, row?.clickTime, row?.created_at, row?.createdAt,
    row?.date_time, row?.dateTime, row?.click_date, row?.clickDate,
    row?.bucket, row?.period, row?.time, row?._id
  ];
  const candidate = candidates.find(value =>
    value !== undefined && value !== null && value !== '' && value !== '-'
  );

  if (candidate instanceof Date) {
    return Number.isNaN(candidate.getTime()) ? null : new Date(candidate);
  }

  if (candidate && typeof candidate === 'object') {
    const year = Number(candidate.year ?? candidate.y);
    const month = Number(candidate.month ?? candidate.m);
    const day = Number(candidate.day ?? candidate.d);
    if (Number.isFinite(year) && Number.isFinite(month) && Number.isFinite(day) && month >= 1 && month <= 12) {
      const hour = Number(candidate.hour ?? candidate.h ?? 0);
      const minute = Number(candidate.minute ?? candidate.min ?? 0);
      return new Date(year, month - 1, day, Number.isFinite(hour) ? hour : 0, Number.isFinite(minute) ? minute : 0);
    }
    const nested = candidate.date ?? candidate.$date ?? candidate.timestamp ?? candidate.$oid;
    if (nested !== undefined && nested !== null) return parseTrafficDate({ timestamp: nested });
    return null;
  }

  if (candidate === undefined || candidate === null || candidate === '' || candidate === '-') return null;

  if (typeof candidate === 'number') {
    const date = new Date(Math.abs(candidate) < 1e12 ? candidate * 1000 : candidate);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const text = String(candidate).trim();
  if (!text) return null;

  // MongoDB ObjectId stores its creation timestamp in the first 8 hex digits.
  if (/^[a-f0-9]{24}$/i.test(text)) {
    const seconds = Number.parseInt(text.slice(0, 8), 16);
    const date = new Date(seconds * 1000);
    if (!Number.isNaN(date.getTime())) return date;
  }

  // Indonesian DD/MM/YYYY or DD-MM-YYYY timestamps, with optional time.
  const dayFirstMatch = text.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})(?:[ T]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
  if (dayFirstMatch) {
    const [, day, month, year, hour = '0', minute = '0', second = '0'] = dayFirstMatch;
    const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second));
    if (
      date.getFullYear() === Number(year) &&
      date.getMonth() === Number(month) - 1 &&
      date.getDate() === Number(day) &&
      !Number.isNaN(date.getTime())
    ) return date;
  }

  // YYYY-MM-DD and SQL-style local datetime without an explicit timezone.
  const localMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?)?$/);
  if (localMatch) {
    const [, year, month, day, hour = '0', minute = '0', second = '0', fraction = '0'] = localMatch;
    const millis = Number(`0.${fraction}`) * 1000;
    const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second), Math.floor(millis));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date;
}

function readNumericField(row, keys) {
  for (const key of keys) {
    if (row?.[key] !== undefined && row?.[key] !== null && row?.[key] !== '') {
      const value = Number(row[key]);
      if (Number.isFinite(value)) return Math.max(0, value);
    }
  }
  return undefined;
}

function normalizeTrafficRows(rows) {
  return rows.map((row, index) => {
    const rawFraudField = row?.fraud;
    const fraudFieldIsLabel = typeof rawFraudField === 'boolean' || (
      typeof rawFraudField === 'string' && rawFraudField.trim() !== '' && !Number.isFinite(Number(rawFraudField))
    );
    const fraudValue = readNumericField(row, [
      'fraudCount', 'fraud_count', ...(!fraudFieldIsLabel ? ['fraud'] : []),
      'fraudEvents', 'fraud_events', 'fraudulentCount', 'fraudClicks', 'fraud_clicks'
    ]);
    const totalValue = readNumericField(row, [
      'totalEvents', 'total_events', 'total', 'eventCount', 'event_count',
      'eventTotal', 'count', 'clickCount', 'click_count', 'clicks', 'totalClicks'
    ]);
    const validValue = readNumericField(row, [
      'validCount', 'valid_count', 'valid', 'validEvents', 'valid_events', 'validClicks', 'valid_clicks'
    ]);

    const date = parseTrafficDate(row);
    const hasAggregateFields = fraudValue !== undefined || totalValue !== undefined || validValue !== undefined;

    // Some endpoints return one row per click instead of pre-aggregated counts.
    // Recognize those rows too, so valid/fraud events are not discarded.
    if (!hasAggregateFields) {
      const rawClassification = String(row?.classification ?? row?.status ?? row?.label ?? '').trim().toLowerCase();
      const fraudFlag = row?.is_fraudulent ?? row?.isFraudulent ?? row?.fraudulent ??
        (typeof row?.fraud === 'boolean' || (typeof row?.fraud === 'string' && !Number.isFinite(Number(row.fraud))) ? row.fraud : undefined);
      const hasClassification = ['fraud', 'valid', 'legitimate', 'non-fraud', 'nonfraud'].includes(rawClassification) || fraudFlag !== undefined;
      if (!date || !hasClassification) return null;
      const isFraud = asBoolean(fraudFlag) || ['fraud'].includes(rawClassification);
      return { date, total: 1, fraud: isFraud ? 1 : 0, valid: isFraud ? 0 : 1, order: index };
    }

    const fraud = fraudValue ?? 0;
    const valid = validValue ?? Math.max(0, (totalValue ?? fraud) - fraud);
    const total = totalValue ?? (fraud + valid);

    return { date, total, fraud, valid, order: index };
  }).filter(row => row && Number.isFinite(row.total) && Number.isFinite(row.fraud) && Number.isFinite(row.valid))
    .sort((a, b) => {
      if (a.date && b.date) return a.date.getTime() - b.date.getTime();
      if (a.date) return -1;
      if (b.date) return 1;
      return a.order - b.order;
    });
}

function periodConfig(period) {
  // Rentang historis dibuat cukup panjang agar data 2024, 2025, dan 2026
  // dapat dijelajahi dengan scroll ketika timestamp tersebut tersedia dari API.
  if (period === 'hour') return { count: 24, interval: 'hour', label: 'Per jam' };
  if (period === 'day') return { count: 1096, interval: 'day', label: 'Per hari' };
  if (period === 'week') return { count: 157, interval: 'day', label: 'Per minggu' };
  if (period === 'month') return { count: 36, interval: 'day', label: 'Per bulan' };
  return { count: 3, interval: 'day', label: 'Per tahun' };
}

function startOfHour(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfYear(date) {
  return new Date(date.getFullYear(), 0, 1);
}

function dayOrdinal(date) {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS);
}

function hourLabel(date) {
  return `${String(date.getHours()).padStart(2, '0')}:00`;
}

function dayLabel(date) {
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

function monthLabel(date) {
  return new Intl.DateTimeFormat('id-ID', { month: 'short', year: 'numeric' }).format(date);
}

function createTimeline(period, now = new Date()) {
  const timeline = [];
  const pushBucket = (date, label) => timeline.push({
    key: `${period}-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${period === 'hour' ? date.getHours() : ''}`,
    date,
    label,
    total: 0,
    valid: 0,
    fraud: 0
  });

  // Historical views are deliberately anchored to 1 Jan 2024 through 31 Dec 2026.
  // This prevents the chart from silently shifting to 2022/2023 due to a wrong clock.
  if (period === 'hour') {
    for (let offset = 23; offset >= 0; offset -= 1) {
      const date = startOfHour(now);
      date.setHours(date.getHours() - offset);
      pushBucket(date, hourLabel(date));
    }
  } else if (period === 'day') {
    for (let date = new Date(2024, 0, 1); date <= new Date(2026, 11, 31); date.setDate(date.getDate() + 1)) {
      const pointDate = new Date(date);
      pushBucket(pointDate, dayLabel(pointDate));
    }
  } else if (period === 'week') {
    for (let date = new Date(2024, 0, 1); date <= new Date(2026, 11, 31); date.setDate(date.getDate() + 7)) {
      const pointDate = new Date(date);
      pushBucket(pointDate, dayLabel(pointDate));
    }
  } else if (period === 'month') {
    for (let year = 2024; year <= 2026; year += 1) {
      for (let month = 0; month < 12; month += 1) {
        const date = new Date(year, month, 1);
        pushBucket(date, monthLabel(date));
      }
    }
  } else {
    for (let year = 2024; year <= 2026; year += 1) {
      const date = new Date(year, 0, 1);
      pushBucket(date, String(year));
    }
  }

  return timeline;
}

function getBucketIndex(eventDate, timeline, period, now = new Date()) {
  if (!(eventDate instanceof Date) || Number.isNaN(eventDate.getTime()) || !timeline.length) return -1;

  if (period === 'hour') {
    const eventHour = startOfHour(eventDate).getTime();
    return timeline.findIndex(bucket => bucket.date.getTime() === eventHour);
  }

  // Historical periods are anchored to the explicit 2024–2026 timeline above.
  // Map API timestamps to those buckets rather than calculating relative to today's clock.
  const firstDate = timeline[0].date;
  if (eventDate < firstDate || eventDate > new Date(2026, 11, 31, 23, 59, 59, 999)) return -1;

  if (period === 'day') {
    const index = dayOrdinal(startOfDay(eventDate)) - dayOrdinal(firstDate);
    return index >= 0 && index < timeline.length ? index : -1;
  }

  if (period === 'week') {
    const daysFromStart = dayOrdinal(startOfDay(eventDate)) - dayOrdinal(firstDate);
    const index = Math.floor(daysFromStart / 7);
    return index >= 0 && index < timeline.length ? index : -1;
  }

  if (period === 'month') {
    const index = (eventDate.getFullYear() - 2024) * 12 + eventDate.getMonth();
    return index >= 0 && index < timeline.length ? index : -1;
  }

  const index = eventDate.getFullYear() - 2024;
  return index >= 0 && index < timeline.length ? index : -1;
}

function aggregateRowsIntoTimeline(rows, period, now = new Date()) {
  const timeline = createTimeline(period, now);
  for (const row of rows) {
    if (!row.date || Number.isNaN(row.date.getTime())) continue;
    const index = getBucketIndex(row.date, timeline, period, now);
    if (index < 0) continue;
    timeline[index].valid += row.valid;
    timeline[index].fraud += row.fraud;
    timeline[index].total += row.total;
  }
  return timeline;
}

function bucketsFromApi(rows, period, now = new Date()) {
  const normalizedRows = normalizeTrafficRows(rows).filter(
    row => row.date instanceof Date && !Number.isNaN(row.date.getTime())
  );

  // API bisa berisi data historis. Gunakan tanggal terbaru dari respons sebagai
  // ujung timeline agar data lama tidak hilang karena dibandingkan dengan hari ini.
  const latestDate = normalizedRows.reduce(
    (latest, row) => (!latest || row.date > latest ? row.date : latest),
    null
  );
  const anchorDate = latestDate || now;

  return {
    buckets: aggregateRowsIntoTimeline(normalizedRows, period, anchorDate),
    rows: normalizedRows,
    hasDatedRows: normalizedRows.length > 0,
    hasEvents: normalizedRows.some(row => row.total > 0),
    anchorDate
  };
}

function bucketsFromEvents(events, period, now = new Date()) {
  const rows = events.map(event => {
    const date = parseTrafficDate({ timestamp: getEventTimestamp(event) });
    if (!date) return null;
    const fraudulent = asBoolean(event.is_fraudulent ?? event.isFraudulent) ||
      String(event.classification ?? '').toLowerCase() === 'fraud';
    return {
      date,
      total: 1,
      fraud: fraudulent ? 1 : 0,
      valid: fraudulent ? 0 : 1
    };
  }).filter(Boolean);
  return {
    buckets: aggregateRowsIntoTimeline(rows, period, now),
    rows,
    hasDatedRows: rows.length > 0,
    hasEvents: rows.length > 0
  };
}

function extractTrafficRows(payload) {
  if (Array.isArray(payload)) return payload;
  const candidates = [
    payload?.data,
    payload?.data?.data,
    payload?.data?.traffic,
    payload?.data?.events,
    payload?.data?.items,
    payload?.traffic,
    payload?.events,
    payload?.results,
    payload?.result?.data,
    payload?.result?.traffic,
    payload?.items
  ];
  return candidates.find(Array.isArray) || [];
}

function apiRange(period, now) {
  const count = periodConfig(period).count;
  let start;
  if (period === 'hour') {
    start = startOfHour(now);
    start.setHours(start.getHours() - (count - 1));
  } else if (period === 'day') {
    start = startOfDay(now);
    start.setDate(start.getDate() - (count - 1));
  } else if (period === 'week') {
    // Include all seven calendar days for every seven-day bucket, including the oldest one.
    start = startOfDay(now);
    start.setDate(start.getDate() - (count * 7 - 1));
  } else if (period === 'month') {
    start = new Date(now.getFullYear(), now.getMonth() - (count - 1), 1);
  } else {
    start = new Date(now.getFullYear() - (count - 1), 0, 1);
  }
  return { start, end: new Date(now) };
}

/*
 * Preview-only scatter data. It is deliberately deterministic so points do not
 * jump around on each render. Never used when the API contains usable traffic
 * or when the local dataset has enough dated rows. These points are explicitly
 * labelled as illustrative in the chart, not as historical event records.
 */
function createDemoScatterData(buckets, period) {
  const count = Math.max(1, buckets.length);
  const cellWidth = 100 / count;
  const phase = { hour: 0.15, day: 0.45, week: 0.8, month: 1.35, year: 2.05 }[period] ?? 0.15;
  const offsets = [-0.36, -0.18, 0, 0.18, 0.36];
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const noise = (bucketIndex, sampleIndex, seriesSeed) => {
    const raw = Math.sin((bucketIndex + 1) * 12.9898 + (sampleIndex + 1) * 78.233 + seriesSeed * 37.719) * 43758.5453;
    return (raw - Math.floor(raw)) * 2 - 1;
  };

  const means = [];
  const samples = [];

  buckets.forEach((bucket, index) => {
    const t = count === 1 ? 0.5 : index / (count - 1);
    const validMean = Math.round(clamp(
      22 + 5.1 * Math.sin(index * 1.28 + phase) + 3.0 * Math.cos(index * 0.62 + 0.7) + 1.8 * (t - 0.5),
      13, 34
    ));
    const fraudMean = Math.round(clamp(
      5.4 + 2.25 * Math.sin(index * 1.17 + phase + 0.6) + 1.05 * Math.cos(index * 0.72 + 0.25),
      1, 10
    ));
    const total = validMean + fraudMean;

    means.push({ ...bucket, valid: validMean, fraud: fraudMean, total, isSynthetic: true });

    [
      { series: 'Valid', mean: validMean, spread: 8.5, seed: 1 },
      { series: 'Fraud', mean: fraudMean, spread: 3.8, seed: 2 }
    ].forEach(({ series, mean, spread, seed }) => {
      offsets.forEach((offset, sampleIndex) => {
        const value = Math.round(clamp(
          mean + noise(index, sampleIndex, seed + phase * 10) * spread,
          series === 'Valid' ? 4 : 0,
          series === 'Valid' ? 38 : 14
        ));
        samples.push({
          x: ((index + 0.5) / count) * 100 + offset * cellWidth,
          count: value,
          series,
          label: bucket.label,
          bucketIndex: index,
          sampleIndex,
          total,
          validTotal: validMean,
          fraudTotal: fraudMean,
          fraudRate: total ? fraudMean / total * 100 : 0,
          isSynthetic: true
        });
      });
    });
  });

  return { means, samples };
}

function TrafficChart({ events, period }) {
  const [apiTraffic, setApiTraffic] = useState({ status: 'loading', rows: [] });
  const [hovered, setHovered] = useState(null);
  const [now, setNow] = useState(() => new Date());

  // Update display time regularly. The API is refreshed only when the current hour changes.
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const currentHourKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`;

  useEffect(() => {
    const controller = new AbortController();
    let alive = true;
    const endpoint = getApiEndpoint('monitoring/traffic');
    // Jangan batasi ke tanggal/jam saat ini: dataset backend dapat berisi
    // histori lama. Ambil interval yang diminta, lalu pilih bucket di frontend.
    const query = new URLSearchParams({
      interval: periodConfig(period).interval
    });

    // Keep the last successful points visible while the next interval loads.
    // This avoids a flash to an empty/demo chart during period changes.
    setApiTraffic(previous => ({ ...previous, status: 'loading', rows: previous.rows || [] }));
    setHovered(null);
    fetch(`${endpoint}?${query.toString()}`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal
    })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(async payload => {
        const rows = extractTrafficRows(payload);
        if (rows.length) {
          if (alive) setApiTraffic({ status: 'success', rows, source: 'traffic' });
          return;
        }

        // Beberapa interval (terutama per jam) bisa mengembalikan agregasi kosong
        // karena rentang endpoint mengacu ke waktu sekarang, sementara event yang
        // tersimpan adalah histori. Fallback ke event API agar grafik tetap memakai
        // timestamp aktual, bukan preview simulasi.
        try {
          const eventsEndpoint = getApiEndpoint('events');
          const eventsResponse = await fetch(`${eventsEndpoint}?page=1&limit=5000`, {
            headers: { Accept: 'application/json' },
            signal: controller.signal
          });
          if (!eventsResponse.ok) throw new Error(`HTTP ${eventsResponse.status}`);
          const eventsPayload = await eventsResponse.json();
          const eventRows = extractTrafficRows(eventsPayload);
          if (alive && eventRows.length) {
            setApiTraffic({ status: 'success', rows: eventRows, source: 'events-fallback', trafficRows: 0 });
          } else if (alive) {
            setApiTraffic({ status: 'empty', rows: [], source: 'traffic' });
          }
        } catch (fallbackError) {
          if (alive && fallbackError.name !== 'AbortError') {
            setApiTraffic({ status: 'empty', rows: [], source: 'traffic' });
          }
        }
      })
      .catch(error => {
        if (alive && error.name !== 'AbortError') {
          setApiTraffic({ status: 'error', rows: [], message: explainApiError(error, 'GET /api/monitoring/traffic') });
        }
      });

    return () => {
      alive = false;
      controller.abort();
    };
    // currentHourKey intentionally changes only when the selected hour changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, currentHourKey]);

  const apiResult = useMemo(
    () => bucketsFromApi(apiTraffic.rows, period, now),
    [apiTraffic.rows, period, now]
  );
  const localResult = useMemo(
    () => bucketsFromEvents(events, period, now),
    [events, period, now]
  );

  const apiCurrentHasData = apiResult.buckets.some(bucket => bucket.total > 0);
  const localCurrentHasData = localResult.buckets.some(bucket => bucket.total > 0);
  let buckets;
  let useApiData = false;
  let useLocalDatedData = false;
  if (apiTraffic.status === 'success' && apiCurrentHasData) {
    buckets = apiResult.buckets;
    useApiData = true;
  } else if (localCurrentHasData) {
    buckets = localResult.buckets;
    useLocalDatedData = true;
  } else if (apiResult.hasDatedRows && apiResult.buckets.some(bucket => bucket.total > 0)) {
    buckets = apiResult.buckets;
    useApiData = true;
  } else {
    // Sumbu waktu selalu berakhir pada periode sekarang, bukan bergeser ke
    // timestamp historis terakhir yang kebetulan tersedia di dataset.
    buckets = createTimeline(period, now);
  }

  // Bila data API belum tersedia dan sampel lokal masih sedikit, gunakan
  // sebaran demo yang padat untuk preview. Periode/label tetap berasal dari
  // timeline aktual saat ini; titik simulasi diberi keterangan yang jelas.
  const hasUsableBucketData = buckets.some(bucket => bucket.total > 0);
  const useDemoCloud = !useApiData && (
    apiTraffic.status !== 'success' || localResult.rows.length < 48 || !hasUsableBucketData
  );
  const demoData = useDemoCloud ? createDemoScatterData(buckets, period) : null;
  const displayBuckets = demoData ? demoData.means : buckets;
  const hasData = Boolean(demoData) || displayBuckets.some(bucket => bucket.total > 0);

  const sampleMax = demoData ? Math.max(0, ...demoData.samples.map(point => point.count)) : 0;
  const maxValue = Math.max(
    1,
    ...displayBuckets.flatMap(bucket => [bucket.valid, bucket.fraud]),
    sampleMax
  );
  const axisMax = Math.max(1, Math.ceil(maxValue * 1.15));
  // Pusat setiap titik sejajar dengan label; sebaran demo hanya digeser
  // sedikit di dalam interval supaya banyak titik tidak menumpuk persis.
  const xFor = index => ((index + 0.5) / Math.max(1, displayBuckets.length)) * 100;
  const yFor = value => 96 - (value / axisMax) * 92;

  const validPoints = displayBuckets.map((bucket, index) => ({
    x: xFor(index), y: yFor(bucket.valid), bucket, bucketIndex: index,
    series: 'Valid', count: bucket.valid
  }));
  const fraudPoints = displayBuckets.map((bucket, index) => ({
    x: xFor(index), y: yFor(bucket.fraud), bucket, bucketIndex: index,
    series: 'Fraud', count: bucket.fraud
  }));
  const allPoints = [...validPoints, ...fraudPoints].map(point => ({
    ...point,
    total: point.bucket.total,
    validTotal: point.bucket.valid,
    fraudTotal: point.bucket.fraud,
    label: point.bucket.label,
    fraudRate: point.bucket.total ? point.bucket.fraud / point.bucket.total * 100 : 0,
    radius: Math.min(7, 3.3 + Math.sqrt(point.count) * 0.2),
    isSynthetic: Boolean(demoData)
  }));
  const cloudPoints = demoData
    ? demoData.samples.map(point => ({ ...point, y: yFor(point.count) }))
    : [];

  // Least-squares regression menghasilkan satu garis lurus panjang yang
  // mengikuti kecenderungan rata-rata sebaran, bukan zig-zag antar titik.
  const trendLine = points => {
    if (points.length < 2) return null;
    const meanX = points.reduce((sum, point) => sum + point.x, 0) / points.length;
    const meanY = points.reduce((sum, point) => sum + point.y, 0) / points.length;
    const numerator = points.reduce(
      (sum, point) => sum + (point.x - meanX) * (point.y - meanY), 0
    );
    const denominator = points.reduce(
      (sum, point) => sum + (point.x - meanX) ** 2, 0
    );
    const slope = denominator ? numerator / denominator : 0;
    const intercept = meanY - slope * meanX;
    return {
      x1: 0,
      y1: Math.max(4, Math.min(96, slope * 0 + intercept)),
      x2: 100,
      y2: Math.max(4, Math.min(96, slope * 100 + intercept))
    };
  };
  const validTrend = trendLine(demoData ? cloudPoints.filter(point => point.series === 'Valid') : validPoints);
  const fraudTrend = trendLine(demoData ? cloudPoints.filter(point => point.series === 'Fraud') : fraudPoints);

  let sourceText;
  if (useApiData) sourceText = 'Sumber: Express API · data historis';
  else if (useDemoCloud) sourceText = 'Preview distribusi demo · titik sintetis, bukan histori aktual';
  else if (useLocalDatedData) sourceText = 'Sumber: dataset lokal · timestamp event';
  else if (apiTraffic.status === 'loading') sourceText = 'Memeriksa data historis dari API';
  else if (apiTraffic.status === 'error') sourceText = 'API tidak terhubung · data bertanggal belum tersedia';
  else sourceText = 'Belum ada data bertanggal yang dapat digambarkan';

  const chartLabel = period === 'hour' ? 'Jam' : period === 'day' ? 'Hari' : period === 'week' ? 'Minggu' : period === 'month' ? 'Bulan' : 'Tahun';
  // Every interval receives a label so dates/months never appear to be skipped.
  const showEvery = 1;

  const apiStatusLabel = apiTraffic.status === 'success'
    ? apiTraffic.source === 'events-fallback'
      ? `API traffic merespons · agregat interval kosong; grafik memakai ${apiTraffic.rows.length.toLocaleString('id-ID')} baris event API historis`
      : `API traffic berhasil · ${apiTraffic.rows.length.toLocaleString('id-ID')} baris respons`
    : apiTraffic.status === 'empty'
      ? 'API merespons, tetapi belum ada data traffic atau event bertanggal untuk periode ini'
      : apiTraffic.status === 'error'
        ? `API traffic gagal · ${apiTraffic.message || 'periksa koneksi backend'}`
        : 'API traffic sedang diperiksa…';

  return (
    <>
      <div className={`api-status api-status-${apiTraffic.status}`} role="status" aria-live="polite">
        <span className="api-status-dot" />{apiStatusLabel}
      </div>
      <div className="scatter-chart" role="group" aria-label={`Grafik garis traffic valid dan fraud per ${chartLabel.toLowerCase()}`}>
        <div className="scatter-y-axis" aria-hidden="true">
          {[3, 2, 1, 0].map(level => <span key={level}>{Math.round(axisMax * level / 3)}</span>)}
        </div>
        <div
          className="scatter-scroll"
          style={{ width: '100%', minWidth: 0, overflowX: 'auto', overflowY: 'visible', scrollbarGutter: 'stable', paddingBottom: '8px' }}
          aria-label="Area grafik yang dapat digulir ke kanan dan kiri untuk melihat periode lain"
        >
        <div
          className="scatter-main"
          style={{ minWidth: `${Math.max(720, buckets.length * (period === 'hour' ? 84 : period === 'day' ? 92 : 110))}px` }}
        >
          <div className="scatter-plot-area" onMouseLeave={() => setHovered(null)} style={{ transition: 'opacity 260ms ease-in-out' }}>
            {[0, 1, 2, 3].map(level => (
              <div key={level} className="scatter-gridline" style={{ top: `${4 + (level / 3) * 92}%` }} />
            ))}
            {hasData && displayBuckets.length >= 2 && (
              <svg
                className="scatter-series-lines"
                style={{ transition: 'opacity 700ms ease-in-out' }}
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                role="img"
                aria-label="Garis tren linear biru untuk Valid dan merah untuk Fraud"
              >
                {validTrend && (
                  <line
                    className="series-line-valid"
                    x1={validTrend.x1} y1={validTrend.y1}
                    x2={validTrend.x2} y2={validTrend.y2}
                  />
                )}
                {fraudTrend && (
                  <line
                    className="series-line-fraud"
                    x1={fraudTrend.x1} y1={fraudTrend.y1}
                    x2={fraudTrend.x2} y2={fraudTrend.y2}
                  />
                )}
              </svg>
            )}
            {hasData && cloudPoints.map(point => (
              <span
                key={`sample-${point.bucketIndex}-${point.series}-${point.sampleIndex}`}
                className={`scatter-sample ${point.series === 'Valid' ? 'dot-valid' : 'dot-fraud'}`}
                style={{ left: `${point.x}%`, top: `${point.y}%`, transition: 'left 760ms cubic-bezier(0.22, 1, 0.36, 1), top 760ms cubic-bezier(0.22, 1, 0.36, 1), opacity 420ms ease-in-out, transform 420ms ease-in-out' }}
                aria-hidden="true"
              />
            ))}
            {hasData && allPoints.map(point => {
              const tooltipLabel = point.isSynthetic
                ? `${point.label} — ${point.series}: sekitar ${numberFormat(point.count)} event pada preview demo. Nilai ilustratif, bukan histori aktual.`
                : `${point.label} — ${point.series}: ${numberFormat(point.count)} event; total ${numberFormat(point.total)}; valid ${numberFormat(point.validTotal)}; fraud ${numberFormat(point.fraudTotal)}; fraud rate ${percent(point.fraudRate)}.`;
              return (
                <button
                  key={`${point.bucketIndex}-${point.series}`}
                  type="button"
                  className={`scatter-dot ${point.series === 'Valid' ? 'dot-valid' : 'dot-fraud'}`}
                  style={{
                    left: `${point.x}%`,
                    top: `${point.y}%`,
                    width: `${Math.max(9, point.radius * 2)}px`,
                    height: `${Math.max(9, point.radius * 2)}px`,
                    transition: 'left 760ms cubic-bezier(0.22, 1, 0.36, 1), top 760ms cubic-bezier(0.22, 1, 0.36, 1), width 420ms ease-in-out, height 420ms ease-in-out, opacity 420ms ease-in-out, box-shadow 420ms ease-in-out'
                  }}
                  aria-label={tooltipLabel}
                  title={tooltipLabel}
                  onMouseEnter={() => setHovered(point)}
                  onFocus={() => setHovered(point)}
                  onBlur={() => setHovered(null)}
                  onClick={() => setHovered(point)}
                />
              );
            })}
            {hovered && (
              <div
                className="scatter-tooltip"
                style={{
                  left: `${Math.min(70, Math.max(2, hovered.x))}%`,
                  top: `${Math.min(78, Math.max(18, hovered.y))}%`
                }}
                role="status"
                aria-live="polite"
              >
                <strong>{hovered.label} · {hovered.series}</strong>
                <span>Event {hovered.series.toLowerCase()}: <b>{numberFormat(hovered.count)}</b></span>
                <span>Total traffic interval: <b>{numberFormat(hovered.total)}</b></span>
                <span>Valid: {numberFormat(hovered.validTotal)} · Fraud: {numberFormat(hovered.fraudTotal)}</span>
                <span>Fraud rate: {percent(hovered.fraudRate)}</span>
              </div>
            )}
          </div>
          <div className="scatter-x-axis" style={{ gridTemplateColumns: `repeat(${Math.max(1, buckets.length)}, minmax(0, 1fr))` }}>
            {buckets.map((bucket, index) => (
              <span
                key={bucket.key ?? `${bucket.label}-${index}`}
                title={period === 'hour' ? `${bucket.label} · ${dayLabel(bucket.date)}` : bucket.label}
              >
                {index % showEvery === 0 || index === buckets.length - 1 ? (
                  <>
                    <span>{bucket.label}</span>
                    {period === 'hour' && (
                      <small
                        className="hour-date-label"
                        style={{ display: 'block', fontSize: '12px', fontWeight: 700, lineHeight: 1.3, color: '#52627a', marginTop: '4px', letterSpacing: '0.1px', whiteSpace: 'nowrap' }}
                      >
                        {dayLabel(bucket.date)}
                      </small>
                    )}
                  </>
                ) : ''}
              </span>
            ))}
          </div>
        </div>
        </div>
      </div>
      {useDemoCloud && (
        <div className="chart-demo-note" role="note">
          Data bertanggal belum cukup untuk membentuk sebaran yang padat. Titik kecil dan garis tren pada mode preview ini adalah data simulasi untuk memperlihatkan distribusi dan regresi linear, bukan catatan event aktual.
        </div>
      )}
      {!hasData && (
        <div className="chart-empty">
          Belum ada event bertanggal yang dapat digambarkan. Periksa format timestamp pada dataset atau respons endpoint traffic.
        </div>
      )}
      <div className="scatter-axis-caption">
        Sumbu X: {chartLabel.toLowerCase()} · Sumbu Y: jumlah event. Garis biru: tren Valid; garis merah: tren Fraud. Gulir area grafik ke kanan atau kiri untuk melihat periode/tanggal lain.{useDemoCloud ? ' Titik kecil adalah sampel simulasi.' : ' Periode tanpa record pada sumber data ditampilkan 0.'}
      </div>
      <div
          className="hour-date-explanation"
          role="note"
          style={{ marginTop: '8px', padding: '10px 12px', borderRadius: '10px', background: '#f4f7ff', border: '1px solid #dce6ff', color: '#40516b', fontSize: '13px', lineHeight: 1.55 }}
        >
          <strong style={{ display: 'block', fontSize: '13px', marginBottom: '2px' }}>Cara membaca tanggal dan jam</strong>
          Rentang historis Per hari, Per minggu, Per bulan, dan Per tahun dikunci dari 1 Januari 2024 sampai 31 Desember 2026 agar label tidak bergeser ke 2022 atau 2023 akibat jam sistem. Gunakan scroll horizontal untuk menjelajahi seluruh periode. Tanggal dan tahun bucket mengikuti rentang kalender tersebut; jumlah Valid/Fraud hanya dihitung dari event API yang timestamp-nya masuk ke bucket. Jika API tidak mengembalikan event untuk tanggal tertentu, nilainya 0—grafik tidak membuat event palsu. Per jam tetap menampilkan 24 jam terakhir berdasarkan waktu saat ini.
        </div>

      <section
        className="traffic-calculation-panel"
        aria-labelledby="traffic-calculation-title"
        style={{
          marginTop: '18px',
          padding: '18px 20px',
          border: '1px solid #dfe7f5',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #fbfcff 0%, #f7f9ff 100%)',
          color: '#52627a',
          fontSize: '13px',
          lineHeight: 1.65
        }}
      >
        <h3
          id="traffic-calculation-title"
          style={{ margin: '0 0 12px', color: '#172b4d', fontSize: '15px', fontWeight: 750 }}
        >
          Perhitungan &amp; kategori event
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
          <code style={{ background: '#fff', border: '1px solid #dce5f4', borderRadius: '9px', padding: '7px 10px', color: '#40516b' }}>
            Valid = jumlah label 0
          </code>
          <code style={{ background: '#fff', border: '1px solid #dce5f4', borderRadius: '9px', padding: '7px 10px', color: '#40516b' }}>
            Fraud = jumlah label 1
          </code>
          <code style={{ background: '#fff', border: '1px solid #dce5f4', borderRadius: '9px', padding: '7px 10px', color: '#40516b' }}>
            Total = Valid + Fraud
          </code>
          <code style={{ background: '#fff', border: '1px solid #dce5f4', borderRadius: '9px', padding: '7px 10px', color: '#40516b' }}>
            Fraud rate = (Fraud ÷ Total) × 100%
          </code>
        </div>
        <p style={{ margin: '6px 0' }}><strong style={{ color: '#40516b' }}>Valid:</strong> <code>is_fraudulent = 0</code>.</p>
        <p style={{ margin: '6px 0' }}><strong style={{ color: '#40516b' }}>Fraud:</strong> <code>is_fraudulent = 1</code>.</p>
        <p style={{ margin: '8px 0' }}>
          Grafik saat ini menggunakan agregasi <strong>{period === 'hour' ? 'per jam' : period === 'day' ? 'per hari' : period === 'week' ? 'per minggu' : period === 'month' ? 'per bulan' : 'per tahun'}</strong>.
          Setiap bucket menghitung jumlah event Valid dan Fraud pada rentang waktu tersebut. Saat periode diganti, bucket dan label waktunya ikut berubah; rumus kategorinya tetap sama.
        </p>
        <p style={{ margin: '8px 0' }}>
          Kategori mengikuti label dataset. Tidak dibuat subkategori atau ambang tambahan karena dataset tidak menyediakan label dan bukti untuk menentukan klasifikasi tersebut.
        </p>
        <p style={{ margin: '8px 0' }}>
          Garis tren solid (biru untuk Valid dan merah untuk Fraud) dihitung dengan regresi linear pada jumlah event per periode dan hanya digunakan untuk membaca kecenderungan naik/turun pada rentang data yang ditampilkan, bukan untuk memprediksi periode berikutnya.
          Garis horizontal 0 event hanya batas bawah sumbu, bukan ambang keputusan fraud.
        </p>
        <p style={{ margin: '12px 0 0', color: '#7a8ba5', fontSize: '12px' }}>
          Rentang grafik mengikuti data yang tersedia dari sumber. Nilai pada setiap titik adalah jumlah event, bukan persentase atau risk score per klik. Data waktu ditampilkan mengikuti label pada sumbu X.
        </p>
      </section>

      <div className="legend">
        <span><i className="legend-blue" />Valid</span>
        <span><i className="legend-red" />Fraud</span>
        <small className="chart-source">{sourceText}</small>
      </div>
    </>
  );
}

function EventTable({ events, onSelect, page, setPage }) {
  const pageCount = Math.max(1, Math.ceil(events.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageEvents = events.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>CLICK ID</th><th>IP ADDRESS</th><th>DEVICE</th><th>TIMESTAMP</th><th>CLASSIFICATION</th><th>RISK</th>
            </tr>
          </thead>
          <tbody>
            {pageEvents.map(event => (
              <tr
                key={event.click_id}
                tabIndex="0"
                onClick={() => onSelect(event)}
                onKeyDown={keyEvent => { if (keyEvent.key === 'Enter') onSelect(event); }}
              >
                <td><b>{event.click_id}</b></td>
                <td className="mono">{event.ip_address}</td>
                <td>{event.device}</td>
                <td>{event.timestamp}</td>
                <td><span className={`class-pill ${event.is_fraudulent ? 'fraud' : 'valid'}`}><i />{event.classification}</span></td>
                <td>
                  <span className="risk-track">
                    <i style={{ width: `${Math.max(0, Math.min(100, event.risk_score))}%`, background: event.is_fraudulent ? 'var(--rose)' : 'var(--blue)' }} />
                  </span>
                  <small>{event.risk_score}</small>
                </td>
              </tr>
            ))}
            {!pageEvents.length && <tr><td colSpan="6">Tidak ada data yang cocok dengan filter.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="table-footer pagination-footer">
        <span className="pagination-info">Halaman {safePage} dari {pageCount} · {events.length} event</span>
        <nav className="pagination-controls" aria-label="Navigasi halaman tabel">
          <button className="pagination-nav" disabled={safePage <= 1} onClick={() => setPage(safePage - 1)}>
            <ChevronLeft size={14} /><span>Sebelumnya</span>
          </button>
          {Array.from({ length: pageCount }, (_, index) => index + 1)
            .filter(number => number === 1 || number === pageCount || Math.abs(number - safePage) <= 1)
            .map(number => (
              <button
                key={number}
                className={`pagination-page ${number === safePage ? 'page-active' : ''}`}
                aria-current={number === safePage ? 'page' : undefined}
                aria-label={`Halaman ${number}`}
                onClick={() => setPage(number)}
              >{number}</button>
            ))}
          <button className="pagination-nav" disabled={safePage >= pageCount} onClick={() => setPage(safePage + 1)}>
            <span>Berikutnya</span><ChevronRight size={14} />
          </button>
        </nav>
      </div>
    </>
  );
}

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [dataSource, setDataSource] = useState('loading');
  const [backendStatus, setBackendStatus] = useState('checking');
  const [modelStatus, setModelStatus] = useState('checking');
  const [active, setActive] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [notificationsRead, setNotificationsRead] = useState(false);
  const [period, setPeriod] = useState('hour');
  const [classFilter, setClassFilter] = useState('all');
  const [deviceFilter, setDeviceFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let alive = true;

    // Check health independently: an empty event collection does NOT mean the API is offline.
    fetch('/health', { headers: { Accept: 'application/json' }, signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(payload => {
        if (alive) setBackendStatus(String(payload?.status || '').toLowerCase() === 'ok' ? 'connected' : 'unknown');
      })
      .catch(error => {
        if (alive && error.name !== 'AbortError') setBackendStatus('offline');
      });

    // Read the model endpoint so the UI can distinguish API connectivity from model readiness.
    fetch(getApiEndpoint('monitoring/metrics'), {
      headers: { Accept: 'application/json' }, signal: controller.signal
    })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(payload => {
        if (!alive) return;
        const status = String(payload?.status ?? payload?.data?.status ?? '').trim();
        setModelStatus(status === 'NO_MODEL_RUN_RECORDED' ? 'no-run' : status ? 'available' : 'unknown');
      })
      .catch(error => {
        if (alive && error.name !== 'AbortError') setModelStatus('unknown');
      });

    // Use the user's exact ClickGuard Demo CSV for the Click event records table.
    // It contains 350 rows (77 Fraud, 273 Valid). Backend health and traffic remain
    // independently API-backed; this does not alter the traffic chart connection.
    if (alive) {
      setEvents(CLICKGUARD_DEMO_EVENTS.map(normalizeEvent));
      setDataSource('demo');
      setLoadError('');
      setLoading(false);
    }

    return () => { alive = false; controller.abort(); };
  }, []);

  const filtered = useMemo(() => events.filter(event =>
    (classFilter === 'all' || (classFilter === 'fraud' ? event.is_fraudulent : !event.is_fraudulent)) &&
    (deviceFilter === 'all' || String(event.device).toLowerCase() === deviceFilter)
  ), [events, classFilter, deviceFilter]);

  const shown = active === 'fraud'
    ? filtered.filter(event => event.is_fraudulent)
    : active === 'blocked'
      ? filtered.filter(event => event.VPN_usage || event.proxy_usage)
      : filtered;

  useEffect(() => { setPage(1); }, [active, classFilter, deviceFilter]);

  const total = filtered.length;
  const fraudCount = filtered.filter(event => event.is_fraudulent).length;
  const validCount = total - fraudCount;
  const fraudRate = total ? fraudCount / total * 100 : 0;

  const downloadReport = () => {
    const rows = [
      ['Laporan ClickGuard', 'Periode 1–19 Oktober 2026'],
      ['Tanggal laporan', '19 Oktober 2026'],
      [],
      ['No', 'Click ID', 'Tanggal event', 'IP Address', 'Perangkat', 'Status', 'Risk score', 'Alasan', 'Keterangan', 'Kesimpulan']
    ];

    events.forEach((event, index) => {
      const reason = event.is_fraudulent
        ? [
            event.VPN_usage && 'VPN terdeteksi',
            event.proxy_usage && 'Proxy terdeteksi',
            Number(event.click_frequency) > 0 && 'Frekuensi klik tercatat'
          ].filter(Boolean).join('; ') || 'Event berlabel fraud pada dataset'
        : 'Event berlabel valid pada dataset';

      rows.push([
        index + 1, event.click_id, event.timestamp, event.ip_address, event.device,
        event.classification, event.risk_score, reason,
        'Klasifikasi mengikuti dataset; belum diverifikasi backend',
        event.is_fraudulent ? 'Perlu ditinjau' : 'Valid menurut label dataset'
      ]);
    });

    rows.push([]);
    rows.push(['Ringkasan', `Total ${events.length} event`]);
    rows.push(['Event berlabel fraud', fraudCount]);
    rows.push(['Event berlabel valid', validCount]);
    rows.push(['Kesimpulan', 'Klasifikasi mengikuti dataset dan perlu validasi backend.']);
    downloadCsv('clickguard-laporan-1-19-oktober-2026.csv', rows);
  };

  const title = {
    overview: 'Overview', events: 'Click events', fraud: 'Fraud monitoring',
    blocked: 'Blocked IPs', settings: 'Pengaturan'
  }[active];

  return (
    <div className="app-shell">
      <Sidebar active={active} onNavigate={setActive} open={mobileOpen} onClose={() => setMobileOpen(false)} eventCount={events.length} />
      <div className="main-shell">
        <Header
          onMenu={() => setMobileOpen(true)}
          onNotifications={() => { setNotifyOpen(value => !value); setNotificationsRead(true); }}
          notificationOpen={notifyOpen}
          unread={!notificationsRead}
        />

        {notifyOpen && (
          <div className="notification-pop">
            <div className="pop-title">
              <b>Notifikasi</b>
              <button onClick={() => setNotifyOpen(false)} aria-label="Tutup"><X size={15} /></button>
            </div>
            <p><span className="notif-dot red" />{fraudCount} event berlabel fraud pada dataset.</p>
            <p><span className="notif-dot blue" />Dataset memuat {numberFormat(events.length)} event.</p>
            <small>Notifikasi berdasarkan dataset lokal, bukan alert backend.</small>
          </div>
        )}

        <main className="content">
          <div className="eyebrow"><span />AD FRAUD DETECTION SYSTEM</div>
          <div className="title-row">
            <div><h1>{title}</h1><p className="lead">{descriptions[active]}</p></div>
            <div className="toolbar">
              {active !== 'settings' && (
                <button className={`btn-filter ${filterOpen ? 'selected' : ''}`} onClick={() => setFilterOpen(value => !value)} aria-expanded={filterOpen}>
                  <Filter size={16} />Filter data<ChevronDown size={14} />
                </button>
              )}
              <button className="btn-download" onClick={downloadReport}><FileDown size={16} />Unduh Laporan</button>
            </div>
          </div>

          {loadError && <div className="demo-banner"><Info size={18} />{loadError}</div>}
          {loading && <p className="loading-message">Memuat dataset...</p>}

          {filterOpen && active !== 'settings' && (
            <div className="filter-panel">
              <div className="filter-heading"><b>Filter event</b><button onClick={() => setFilterOpen(false)} aria-label="Tutup filter"><X size={15} /></button></div>
              <label>Klasifikasi
                <select value={classFilter} onChange={event => setClassFilter(event.target.value)}>
                  <option value="all">Semua</option><option value="fraud">Fraud</option><option value="valid">Valid</option>
                </select>
              </label>
              <label>Perangkat
                <select value={deviceFilter} onChange={event => setDeviceFilter(event.target.value)}>
                  <option value="all">Semua perangkat</option><option value="desktop">Desktop</option><option value="mobile">Mobile</option><option value="tablet">Tablet</option>
                </select>
              </label>
              <button className="clear-filter" onClick={() => { setClassFilter('all'); setDeviceFilter('all'); }}>Reset filter</button>
              <span className="filter-result">Menampilkan {filtered.length} event</span>
            </div>
          )}

          {active === 'settings' ? (
            <section className="panel settings-panel">
              <div className="panel-head">
                <div><h2>Status integrasi</h2><p>Informasi koneksi dashboard</p></div>
                <span className={`status-chip ${backendStatus === 'connected' ? 'status-connected' : ''}`}><span />{backendStatus === 'connected' ? 'Backend terhubung' : backendStatus === 'offline' ? 'Backend offline' : 'Memeriksa backend'}</span>
              </div>
              <div className="setting-row">
                <div><b>Backend</b><p>Express API · GET /health dan /api/events.</p></div><span className="status-chip">{backendStatus === 'connected' ? 'Terhubung' : backendStatus === 'offline' ? 'Offline' : 'Memeriksa'}</span>
              </div>
              <div className="setting-row">
                <div><b>Sumber data</b><p>{dataSource === 'api' ? 'Express API · data aktual' : dataSource === 'demo' ? 'Dataset JSON lokal · preview' : 'Sumber data sedang diperiksa'} · {events.length} event terbaca.</p></div>
                <span className="status-chip"><Check size={13} />Terbaca</span>
              </div>
              <div className="setting-row">
                <div><b>Model deteksi</b><p>{modelStatus === 'no-run' ? 'Belum ada hasil model run tersimpan di MongoDB.' : modelStatus === 'available' ? 'Endpoint metrics mengembalikan status model.' : 'Status model sedang diperiksa.'}</p></div><span className="status-chip">{modelStatus === 'no-run' ? 'Belum ada hasil model' : modelStatus === 'available' ? 'Status tersedia' : 'Belum diverifikasi'}</span>
              </div>
            </section>
          ) : (
            <>
              {active === 'overview' && (
                <>
                  <section className="metrics-grid">
                    <Metric title="Total click events" value="350" sub="Event pada dataset awal" Icon={MousePointer2} tone="blue" delay={0} />
                    <Metric title="Fraud flagged" value="77" sub="Event berlabel fraud" Icon={ShieldAlert} tone="rose" delay={60} />
                    <Metric title="Valid traffic" value="273" sub="Event berlabel valid" Icon={ShieldCheck} tone="green" delay={120} />
                    <Metric title="Fraud rate" value="22,0%" sub="Proporsi event berlabel fraud" Icon={Activity} tone="violet" delay={180} />
                  </section>
                  <section className="panels-grid">
                    <section className="panel traffic-panel">
                      <div className="panel-head">
                        <div><h2>Traffic overview</h2><p>Jumlah event Valid dan Fraud berdasarkan periode waktu</p></div>
                        <div className="chart-actions">
                          <label className="period-select-wrap" aria-label="Pilih periode grafik traffic">
                            <CalendarDays size={14} aria-hidden="true" />
                            <select className="period-select" value={period} onChange={event => setPeriod(event.target.value)} aria-label="Periode traffic">
                              <option value="hour">Per jam</option><option value="day">Per hari</option><option value="week">Per minggu</option><option value="month">Per bulan</option><option value="year">Per tahun</option>
                            </select>
                            <ChevronDown size={13} aria-hidden="true" />
                          </label>
                          <Tooltip>Grafik mengambil agregasi traffic dari GET /api/monitoring/traffic setiap kali periode berubah. Tooltip membaca nilai titik yang sedang ditampilkan; tooltip tidak mengirim request API terpisah. Titik paling kanan mengikuti jam, tanggal, bulan, atau tahun saat ini. Garis lurus menunjukkan regresi linear Valid dan Fraud.</Tooltip>
                        </div>
                      </div>
                      <TrafficChart events={filtered} period={period} />
                    </section>
                    <section className="panel model-panel">
                      <div className="panel-head">
                        <div><h2>Model status</h2><p>Kesiapan model deteksi</p></div>
                        <span className={`status-chip ${backendStatus === 'connected' ? 'status-connected' : ''}`}><span />{backendStatus === 'connected' ? 'Backend terhubung' : backendStatus === 'offline' ? 'Backend offline' : 'Memeriksa backend'}</span>
                      </div>
                      <div className="model-illustration">
                        <div className="orb orb-a" /><div className="orb orb-b" />
                        <div className="model-icon"><Activity size={25} /></div>
                        <b>{modelStatus === 'no-run' ? 'Belum ada hasil model tersimpan' : modelStatus === 'available' ? 'Status model tersedia' : 'Model belum diverifikasi'}</b>
                        <p>{modelStatus === 'no-run' ? 'Backend terhubung, tetapi belum ada hasil model run di MongoDB.' : 'Status model dan hasil deteksi mengikuti respons endpoint backend.'}</p>
                      </div>
                      <div className="model-source"><span>Status integrasi</span><code>{backendStatus === 'connected' ? 'Terhubung' : backendStatus === 'offline' ? 'Offline' : 'Memeriksa'}</code></div>
                    </section>
                  </section>
                </>
              )}
              <section className="panel events-panel">
                <div className="panel-head events-head">
                  <div>
                    <h2>{active === 'fraud' ? 'Fraud events' : active === 'blocked' ? 'Risk signals' : 'Click event records'}</h2>
                    <p>{shown.length} event · pilih baris untuk detail</p>
                  </div>
                  <span className="table-badge">{shown.length} events</span>
                </div>
                <EventTable events={shown} onSelect={setSelected} page={page} setPage={setPage} />
              </section>
            </>
          )}

          <footer>
            <span>© 2026 ClickGuard · Sistem Deteksi Fraud Klik Iklan Digital</span>
            <span className="footer-state"><i />{backendStatus === 'connected' ? (dataSource === 'api' ? 'Backend terhubung · data API' : 'Backend terhubung · preview dataset lokal') : backendStatus === 'offline' ? 'Backend offline · dataset lokal' : 'Memeriksa koneksi backend'}</span>
          </footer>
        </main>
      </div>

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <section className="detail-modal" onClick={event => event.stopPropagation()}>
            <div className="modal-head">
              <div><small>DETAIL EVENT</small><h3>{selected.click_id}</h3></div>
              <button onClick={() => setSelected(null)} aria-label="Tutup detail"><X size={18} /></button>
            </div>
            <div className="detail-status">
              <span className={`class-pill ${selected.is_fraudulent ? 'fraud' : 'valid'}`}>{selected.classification}</span>
              <b>Risk score {selected.risk_score}/100</b>
            </div>
            <div className="detail-grid">
              {[
                ['IP address', selected.ip_address], ['Timestamp', selected.timestamp],
                ['Device', selected.device], ['Browser', selected.browser], ['OS', selected.operating_system],
                ['Click duration', `${selected.click_duration}s`], ['Scroll depth', `${selected.scroll_depth}%`],
                ['Click frequency', selected.click_frequency], ['VPN usage', selected.VPN_usage ? 'Yes' : 'No'],
                ['Proxy usage', selected.proxy_usage ? 'Yes' : 'No']
              ].map(([key, value]) => <div key={key}><small>{key}</small><b>{value}</b></div>)}
            </div>
            <p className="modal-note">Klasifikasi dan risk score mengikuti nilai yang tersedia pada dataset. Hasil ini belum diverifikasi oleh backend.</p>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
