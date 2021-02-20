import { EAnalyticsEvent, EAnalyticsEventType } from "./AnalyticsManager";

export default abstract class AnalyticsParent{
    abstract init(param: any);

    abstract login(event: EAnalyticsEvent , param: any);

    abstract raiseEvent(eventType: EAnalyticsEventType ,event: EAnalyticsEvent , id: string, param: any);

    enableDebug(debug: boolean){
        
    }
}