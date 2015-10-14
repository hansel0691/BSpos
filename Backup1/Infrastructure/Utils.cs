using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using BlackstonePos.Domain.Models;

namespace OrdersGateway.Infrastructure
{

    public enum Category
    {
        International, Pinless, LongDistance, Wireless
    }

    public static class Utils
    {
        public static string MaskPhoneNumber(this string phoneNumber)
        {
            try
            {
                var phoneMaskedPart = string.Empty.PadLeft(3, '*');
                //var phoneFirstPart = phoneNumber.Substring(0, 3);
                var phoneLastPart = phoneNumber.Substring(phoneNumber.Length - 4);

                var result = phoneMaskedPart + phoneLastPart;

                return result;
            }
            catch (Exception exception)
            {
                return "-";
            }
        }

        public static string GetSignature(string mid, string terminalId, string password, decimal amount, long orderId)
        {

            var data = mid + terminalId + amount.ToString("") + orderId.ToString("0");

            var key = Encoding.UTF8.GetBytes(password);

            var signer = new HMACSHA256(key);

            signer.Initialize();

            var dataBytes = Encoding.UTF8.GetBytes(data.ToCharArray());

            var rawData = signer.ComputeHash(dataBytes);

            var result = Convert.ToBase64String(rawData);

            return result;
        }

        public static long GetTransactionId()
        {
            var transactionId = DateTime.Now.Ticks;

            return transactionId;
        }

        public static bool BelongsToCategory(this string categoryName, Func<IEnumerable<string>> categoryDomain)
        {
            try
            {
                var domain = categoryDomain.Invoke();

                return domain.Any(categoryName.Equals);
            }
            catch (Exception exception)
            {
                return false;
            }
        }

        public static IEnumerable<Initial> GetInitials(this IEnumerable<string> charSet)
        {
            var domain = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".ToCharArray();

            var letters = domain.Select(c => new Initial
            {
                Char = c.ToString(),
                Enable = charSet.Contains(c.ToString())
            });

            var digits = charSet.Where(c=> char.IsDigit(c[0])).Select(c=> new Initial
            {
                Char = c.ToString(), 
                Enable = true
            });

            var result = letters.Union(digits);

            return result;
        }

        public static IEnumerable<Initial> GetInitialsExt<T>(this IList<T> initials)
        {
            var domain = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".ToCharArray();

            var result = initials.Where(c => char.IsDigit(c.ToString()[0])).Select(init => new Initial
            {
                Char = init.ToString(), 
                Enable = true
            
            }).ToList();
            
            result.AddRange(domain.Select(init => new Initial
            {
                Char = init.ToString(),
                Enable = initials.Any(c=> c.ToString() == init.ToString())
            }));

            return result;

        }

        public static string DisplayPropertyName(this string propertyName)
        {
            try
            {
                var result = string.Empty;

                foreach (var item in propertyName)
                {
                    if (char.IsUpper(item) && result.Length > 0)
                        result += " " + item;
                    else
                        result += item;
                }
                return result;
            }
            catch (Exception exception)
            {
                return propertyName;
            }
        }

        public static string Md5Hash(string text)
        {
            var md5 = new MD5CryptoServiceProvider();

            md5.ComputeHash(Encoding.ASCII.GetBytes(text));

            var result = md5.Hash;

            var strBuilder = new StringBuilder();

            foreach (var t in result)
            {
                strBuilder.Append(t.ToString("x2"));
            }

            return strBuilder.ToString();
        }
    }
}