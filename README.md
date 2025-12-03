<p align="center">
  <h1 align="center">Cloud BookHub</h1>
  <p align="center">
    Scalable serverless online bookstore built on AWS with React frontend, Lambda backend, and full CI/CD pipeline.
    <br />
    <a href="https://d1fak5wout0ojg.cloudfront.net/">View Demo</a>
    ·
    <a href="https://github.com/purvii12/Online-Bookstore/issues">Report Bug</a>
    ·
    <a href="https://github.com/purvii12/Online-Bookstore/issues">Request Feature</a>
  </p>
</p>

---

## About The Project

Cloud BookHub demonstrates a production-ready serverless e-commerce pattern on AWS. The React SPA serves book catalog via CloudFront CDN from S3, with backend API powered by Lambda behind API Gateway. Full CI/CD pipeline automates deployments from GitHub, and CloudWatch provides observability [web:1].

## UI
![Cloud BookHub UI](./homeui.png)

---

## Architecture
![Cloud BookHub Architecture](./architecture.png)
*Cloud BookHub architecture: React on S3+CloudFront → API Gateway+Lambda → RDS MySQL (planned).*

---

## Key Features

- Book catalog with images, categories, and rupee pricing
- Search by title and category filtering
- Book details modal with descriptions and stock info
- Client-side shopping cart with quantity controls and totals
- Responsive UI optimized for mobile and desktop
- Serverless backend with CORS-enabled API Gateway
- Automated CI/CD pipeline with CodePipeline and CodeBuild
- CloudWatch monitoring for Lambda and build logs

---

## Tech Stack

| Technology | Purpose |
| ---------- | ------- |
| ![React](https://img.shields.io/badge/React_18-61DAFB?logo=react&logoColor=000000) | Frontend framework |
| ![Amazon S3](https://img.shields.io/badge/Amazon_S3-569A31?logo=amazons3&logoColor=ffffff) | Static website hosting |
| ![CloudFront](https://img.shields.io/badge/Amazon_CloudFront-8C4FFF?logo=amazonaws&logoColor=ffffff) | Global CDN + HTTPS |
| ![Lambda](https://img.shields.io/badge/AWS_Lambda-FF9900?logo=aws-lambda&logoColor=000000) | Serverless backend (Node.js 18) |
| ![API Gateway](https://img.shields.io/badge/Amazon_API_Gateway-FF4F8B?logo=amazonapigateway&logoColor=ffffff) | REST API management |
| ![RDS MySQL](https://img.shields.io/badge/Amazon_RDS_MySQL-527FFF?logo=amazonrds&logoColor=ffffff) | Planned database |
| ![CodePipeline](https://img.shields.io/badge/AWS_CodePipeline-1F73B7?logo=aws&logoColor=ffffff) | CI/CD orchestration |
| ![CodeBuild](https://img.shields.io/badge/AWS_CodeBuild-6DB33F?logo=aws&logoColor=ffffff) | Automated builds |
| ![CloudWatch](https://img.shields.io/badge/Amazon_CloudWatch-FF4F8B?logo=amazoncloudwatch&logoColor=ffffff) | Monitoring and logs |
| ![ACM](https://img.shields.io/badge/AWS_Certificate_Manager-232F3E?logo=amazonaws&logoColor=ffffff) | SSL/TLS certificates |


## Infrastructure Components

| AWS Service | Configuration |
| ----------- | ------------- |
| ![S3](https://img.shields.io/badge/Amazon_S3-569A31?logo=amazons3&logoColor=ffffff) | `bookstore-frontend-khand-123` with public read policy |
| ![CloudFront](https://img.shields.io/badge/Amazon_CloudFront-8C4FFF?logo=amazonaws&logoColor=ffffff) | Redirects HTTP to HTTPS, S3 website endpoint origin |
| ![Lambda](https://img.shields.io/badge/AWS_Lambda-FF9900?logo=aws-lambda&logoColor=000000) | `bookstore-get-books` with in-memory catalog data |
| ![API Gateway](https://img.shields.io/badge/Amazon_API_Gateway-FF4F8B?logo=amazonapigateway&logoColor=ffffff) | HTTP API with GET `/books` route |
| ![CodePipeline](https://img.shields.io/badge/AWS_CodePipeline-1F73B7?logo=aws&logoColor=ffffff) | GitHub → CodeBuild → S3 deploy stages |
| ![CodeBuild](https://img.shields.io/badge/AWS_CodeBuild-6DB33F?logo=aws&logoColor=ffffff) | Node.js 18 build, `npm install` and `npm run build` |
| ![CloudWatch](https://img.shields.io/badge/Amazon_CloudWatch-FF4F8B?logo=amazoncloudwatch&logoColor=ffffff) | Lambda logs in `/aws/lambda/bookstore-get-books` |
| ![ACM](https://img.shields.io/badge/AWS_Certificate_Manager-232F3E?logo=amazonaws&logoColor=ffffff) | Public cert in `us-east-1` attached to CloudFront |


---

## Installation

1. **Clone the repository**
git clone https://github.com/purvii12/Online-Bookstore.git
cd Online-Bookstore

2. **Frontend setup**
npm install
npm run build

3. **Deploy to AWS manually (before CI/CD)**
Upload build/ to S3 bucket
aws s3 sync build/ s3://bookstore-frontend-khand-123 --delete

Create CloudFront distribution pointing to S3 website endpoint

4. **Backend deployment**
Create Lambda function with provided code
Create API Gateway HTTP API with GET /books → Lambda integration
Test: https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/books(replace with your id)

---

![Networking Architecture](./networkingnvpc.png)

---

## Usage

1. Access frontend via CloudFront URL: `https://d1fak5wout0ojg.cloudfront.net/`
2. Browse books, use search and category filters
3. Click book cards for details modal with stock info
4. Add items to cart, adjust quantities, view running totals

**CI/CD Workflow:**
Push to main branch triggers:
GitHub → CodePipeline → CodeBuild → S3 deployment
git add .
git commit -m "Update UI"
git push origin main


## CI/CD 
![Cloud BookHub Pipeline](./codebuild.png)
---

## ACM Certificate Setup

1. Navigate to ACM console in **us-east-1** (required for CloudFront)
2. Request public certificate for your domain (e.g., `yourdomain.com`, `*.yourdomain.com`)
3. Choose **DNS validation** and add CNAME records to Route 53
4. Wait for "Issued" status (5-30 minutes)
5. Attach certificate to CloudFront: Distributions → Edit → Custom SSL Certificate [web:2][web:6]

CloudFront Custom Domain Configuration
Alternate Domain Names (CNAMEs): yourdomain.com, www.yourdomain.com
Custom SSL Certificate: arn:aws:acm:us-east-1:ACCOUNT:certificate/CERT-ID


---

## Deployment Steps

1. **Infrastructure (AWS Console)**
S3 bucket → CloudFront → Lambda → API Gateway → RDS (optional)
IAM roles → CodeBuild project → CodePipeline

2. **CI/CD Setup**
Connect GitHub repo → Create buildspec.yml → CodeBuild project
CodePipeline: Source(github) → Build(codebuild) → Deploy(S3)

3. **Frontend Configuration**
Update `API_BASE` in `App.js` to your API Gateway URL, rebuild, commit to main

---

## Roadmap

- [x] React SPA on S3 + CloudFront with HTTPS
- [x] Lambda + API Gateway serverless backend
- [x] Complete CI/CD pipeline automation
- [x] CloudWatch monitoring and logging
- [x] RDS MySQL instance provisioned
- [ ] RDS database integration in Lambda
- [ ] Amazon Cognito authentication
- [ ] AWS WAF protection for CloudFront
- [ ] Custom domain with Route 53

---

## Contributing

1. Fork the project
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contact

**Purvii** - [@purvii12](https://github.com/purvii12)

Project Link: [https://github.com/purvii12/Online-Bookstore](https://github.com/purvii12/Online-Bookstore)

---

## Acknowledgments

- AWS Documentation for serverless patterns [web:1]
- AWS Samples bookstore demo for reference architecture [web:2]
- React community for excellent frontend ecosystem
