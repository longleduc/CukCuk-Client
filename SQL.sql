UPDATE Customer c  
SET c.CustomerName = CONCAT(c.LastName," ",c.MiddleName," ",c.FirstName);