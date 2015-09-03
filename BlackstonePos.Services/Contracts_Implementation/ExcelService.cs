using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Services.Contracts_Implementation
{
    public static class ExcelService
    {
        public static void CreateCsvFile<T>(this List<T> data, string fileName)
        {
            var stringBuilder = new StringBuilder();

            //Printable Properties Only !NonPrintable (They are less)
            var itemProperties = typeof(T).GetProperties().ToList();

            //First Line
            foreach (var itemProperty in itemProperties)
                stringBuilder.Append(string.Format("{0},", itemProperty.Name));

            stringBuilder.Remove(stringBuilder.Length - 1, 1);
            stringBuilder.Append(Environment.NewLine);

            //Writing Data
            foreach (var item in data)
            {
                if (item == null)
                    continue;

                foreach (var propertyInfo in itemProperties)
                {
                    var itemValue = propertyInfo.GetValue(item);

                    if (itemValue != null)
                        stringBuilder.Append(string.Format("{0},", itemValue));
                }

                stringBuilder.Remove(stringBuilder.Length - 1, 1);
                stringBuilder.Append(Environment.NewLine);
            }

            File.WriteAllLines(fileName, new List<string> { stringBuilder.ToString() });
        }
    }
}
