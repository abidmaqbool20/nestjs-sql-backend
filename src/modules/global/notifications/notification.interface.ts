export interface Notification {
    send(notificationData:any): Promise<Boolean>;
}
