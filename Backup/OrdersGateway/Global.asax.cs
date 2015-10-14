using System;
using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Dependencies;
using System.Web.Http.Description;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using BlackstonePos.Data.Repositories;
using BlackstonePos.Domain.Contracts.Repositories;
using BlackstonePos.Domain.Contracts.Services;
using BS.Services.Contracts_Implementation;
using log4net;
using Metele.common.Contracts.Repositories;
using Metele.common.Contracts.Services;
using Metele.data.Repositories;
using Metele.services;
using Ninject;
using OrdersGateway.Filters;
using OrdersGateway.Mailers;
using CashierRepository = Metele.data.Repositories.CashierRepository;
using IDependencyResolver = System.Web.Http.Dependencies.IDependencyResolver;

namespace OrdersGateway
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            log4net.Config.XmlConfigurator.Configure();

            GlobalConfiguration.Configuration.DependencyResolver = new MyDependencyResolver();
            
            //Adding Filters
            GlobalConfiguration.Configuration.Filters.Add(new CORSInterceptor());
            GlobalConfiguration.Configuration.Filters.Add(new LogInterceptor());
            GlobalConfiguration.Configuration.Filters.Add(new ExceptionInterceptor());
            GlobalConfiguration.Configuration.Filters.Add(new AdminFilter());
            GlobalConfiguration.Configuration.Filters.Add(new PageProviderInterceptor());


            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }
    }

    public class MyDependencyResolver : IDependencyResolver
    {


        private IKernel _kernel;

        public MyDependencyResolver()
        {
            _kernel = new StandardKernel();

            Bind();
        }

        private void Bind()
        {
            _kernel.Bind<BaseGiveLongDistanceDenominationsRepository>().To<GiveLongDistaceDenominationsRepository>();
            _kernel.Bind<BaseCashierRepository>().To<CashierRepository>();
            _kernel.Bind<BaseRatesRepository>().To<RatesRepository>();
            _kernel.Bind<BaseAccessNumbersRepository>().To<AccessNumbersRepository>();
            _kernel.Bind<BaseRegisterRepository>().To<RegisterRepository>();
            _kernel.Bind<BasePromotionsRepository>().To<PromotionsRepository>();
            _kernel.Bind<BaseReportsRepository>().To<ReportsRepository>();
            _kernel.Bind<BaseOrdersRepository>().To<OrdersRepository>();
            _kernel.Bind<BasePinlessRepository>().To<PinlessLibRepository>();
            _kernel.Bind<IMeteleService>().To<MeteleService>();

            _kernel.Bind<BasePaymentHistoryRepository>().To<PaymentHistoryRepository>();
            _kernel.Bind<BasePaymentAchRepository>().To<PaymentAchRepository>();
            _kernel.Bind<BasePaymentCheckingRepository>().To<PaymentCheckingRepository>();
            _kernel.Bind<BaseStateRepository>().To<StateRepository>();
            _kernel.Bind<BasePaymentsCreditCardRepository>().To<PaymentsCreditCardRepository>();
            _kernel.Bind<BaseDirectTvProductRepository>().To<DirectTvProductRepository>();
            _kernel.Bind<BaseRegisterContactUsRepository>().To<RegisterContactUsRepository>();
            _kernel.Bind<IPaymentService>().To<PaymentServices>();
            _kernel.Bind<BaseProductRepository>().To<ProductsRepository>();
            _kernel.Bind<BaseInternationalCardsRepository>().To<InternationalCardsRepository>();
            _kernel.Bind<BaseSettingRepository>().To<SettingRepository>();
            _kernel.Bind<BaseWirelessRepository>().To<WirelessRepository>();
            _kernel.Bind<BaseMySmsCubaRepository>().To<MySmsCubaRepository>();
            _kernel.Bind<BasePaxTerminalOrdersRepository>().To<PaxTerminalOrdersRepository>();
            _kernel.Bind<BaseExternalLoginRepository>().To<ExternalLoginRepository>();
            _kernel.Bind<BaseRePrintOrdersRepository>().To<RePrintOrdersRepository>();
            _kernel.Bind<BaseReceiptConfirmationRepository>().To<ReceiptConfirmationRespository>();

            _kernel.Bind<IAchPaymentRepository>().To<AchPaymentRespository>();
            _kernel.Bind<IAchTransactionRepository>().To<AchTransactionRespository>();
            _kernel.Bind<IOrderRepository>().To<OrderRepository>();
            _kernel.Bind<ISettingRepository>().To<SettingsRepository>();
            _kernel.Bind<ILogRepository>().To<LogRepository>();
            _kernel.Bind<ICashierRepository>().To<BlackstonePos.Data.Repositories.CashierRepository>();
            _kernel.Bind<IPromotionsRepository>().To<BsPromotionsRepository>();
            _kernel.Bind<IApplicantRepository>().To<ApplicantRepository>();
            _kernel.Bind<IGuestRepository>().To<GuestRepository>();
            _kernel.Bind<IPaxTerminalPosRepository>().To<PaxTerminalPosRepository>();
            _kernel.Bind<IFullCargaSmsTemplatesRepository>().To<FullCargaSmsTemplatesRepository>();
            _kernel.Bind<IPosMerchantHeader>().To<MerchantsRepository>();
            _kernel.Bind<IBlackstonePosService>().To<BlackstonePosService>();
            _kernel.Bind<IAppLogoRepository>().To<AppLogoRepository>();
            _kernel.Bind<IUserMailer>().To<UserMailer>();
        }

        public void Dispose()
        {

        }

        public object GetService(Type serviceType)
        {
            try
            {
                var result = _kernel.GetService(serviceType);

                return result;
            }
            catch
            {
                return null;
            }
        }

        public IEnumerable<object> GetServices(Type serviceType)
        {
            try
            {
                var result = _kernel.GetAll(serviceType);

                return result;
            }
            catch
            {
                return null;
            }
        }

        public IDependencyScope BeginScope()
        {
            return this;
        }
    }
}