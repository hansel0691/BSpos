using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using BlackstonePos.Domain.Models;
using Metele.utils;

namespace BS.Services.Infrastructure
{

    public enum Category
    {
        International, Pinless, LongDistance, Wireless
    }

    public static class Utils
    {
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

        public static bool IsSimpleType(this Type obj)
        {
            return obj != null && (obj.IsPrimitive || obj == typeof (string));
        }

        #region Sms Ops

        public static string GetBlackstoneSmsFormat<T>(this T smsData, params string[] ignoreProperties)
        {
            var smsItems = smsData.GetType().GetProperties();

            var result = string.Empty;

            foreach (var propertyInfo in smsItems)
            {
                if (ignoreProperties.Contains(propertyInfo.Name))
                    continue;

                var item = propertyInfo.GetValue(smsData, null);

                var propertyName = propertyInfo.Name.DisplayPropertyName();

                if (item != null)
                {
                    result += propertyName + ": " + item + "\n";
                }
            }
            //TODO-> Replace extrange caracters
            result = result.Replace('&', ' ');

            result += "More info at mobile.blackstonepos.com";

            return result;
        }


        #endregion

        /// Created By: Carlos Raul (03102014)
        ///  <summary>
        ///  Splits an string using Upper Case as the condition
        ///  </summary>
        /// <returns></returns>
        public static string DisplayPropertyName(this string propertyName)
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

        public static string SetAmericanFormat(this string phoneNumber)
        {
            try
            {
                var result = new StringBuilder(phoneNumber);
                result.Insert(0, "(");
                result.Insert(4, ")");
                result.Insert(5, "-");
                return result.ToString();
            }
            catch (Exception exception)
            {
                return phoneNumber;
            }
       
        }
    }
}