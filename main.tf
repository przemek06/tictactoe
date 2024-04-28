provider "aws" {
    region = "us-east-1"
}

resource "aws_vpc" "main" {
    cidr_block = "10.0.0.0/16"
    tags = {
        name = "main"
    }
}

resource "aws_internet_gateway" "gw" {
    vpc_id = aws_vpc.main.id
    tags = {
        Name = "main"
    }
}

resource "aws_subnet" "subnet" {
    availability_zone = "us-east-1a"
    vpc_id     = aws_vpc.main.id
    cidr_block = "10.0.10.0/24"
    map_public_ip_on_launch = true
    tags = {
        Name = "subnet"
     }
}

resource "aws_security_group" "security_group" {
    name        = "security_group"
    vpc_id      = aws_vpc.main.id
    description = "security_group"
    ingress = [
        {
            description      = "http"
            from_port        = 80
            to_port          = 80
            protocol         = "tcp"
            cidr_blocks      = ["0.0.0.0/0", aws_vpc.main.cidr_block]
            self              = false
            ipv6_cidr_blocks = []
            prefix_list_ids  = []
            security_groups  = []
        },
        {
            description      = "https"
            from_port        = 443
            to_port          = 443
            protocol         = "tcp"
            cidr_blocks      = ["0.0.0.0/0", aws_vpc.main.cidr_block]
            self             = false
            ipv6_cidr_blocks = []
            prefix_list_ids  = []
            security_groups  = []
        },
        {
            description      = "frontend"
            from_port        = 3000
            to_port          = 3000
            protocol         = "tcp"
            cidr_blocks      = ["0.0.0.0/0", aws_vpc.main.cidr_block]
            self              = false
            ipv6_cidr_blocks = []
            prefix_list_ids  = []
            security_groups  = []
        },
        {
            description      = "backend"
            from_port        = 8080
            to_port          = 8080
            protocol         = "tcp"
            cidr_blocks      = ["0.0.0.0/0", aws_vpc.main.cidr_block]
            self              = false
            ipv6_cidr_blocks = []
            prefix_list_ids  = []
            security_groups  = []
        }
    ]
    egress = [
        {
            description      = "outbound"
            from_port        = 0
            to_port          = 0
            protocol         = "-1"
            cidr_blocks      = ["0.0.0.0/0"]
            self             = false
            ipv6_cidr_blocks = []
            prefix_list_ids  = []
            security_groups  = []
        }
    ]
    tags = {
        name = "security_group"
    }
}

    resource "aws_route_table" "route_table" {
    vpc_id = aws_vpc.main.id

    route {
        cidr_block = "0.0.0.0/0"
        gateway_id = aws_internet_gateway.gw.id
    }
    tags = {
        Name = "route_table"
    }
}

resource "aws_route_table_association" "route_table_association" {
    subnet_id      = aws_subnet.subnet.id
    route_table_id = aws_route_table.route_table.id
}

resource "aws_instance" "backend" {
    instance_type = "t2.micro"
    ami = "ami-04e5276ebb8451442"
    security_groups = [aws_security_group.security_group.id]
    subnet_id     = aws_subnet.subnet.id
    user_data = file("${path.module}/backend.sh")

    tags = {
        Name = "backend"
    }
}

resource "aws_instance" "frontend" {
    instance_type = "t2.micro"
    ami = "ami-04e5276ebb8451442"
    security_groups = [aws_security_group.security_group.id]
    subnet_id     = aws_subnet.subnet.id
    user_data = file("${path.module}/frontend.sh")

    tags = {
        Name = "frontend"
    }
}
