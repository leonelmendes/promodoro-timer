import notifee, { AuthorizationStatus } from '@notifee/react-native'
import { Alert } from 'react-native';


    /*
    await notifee.requestPermission();

        await notifee.createChannel({
                id: 'default',
                name: 'Pomodoro',
            })

        notifee.displayNotification(
            {
                id: 'promodoro_progress',
                title: 'Notificação',
                body: 'Teste da Notioficação',
                subtitle: 'subtitulo da noticacao',

                android: {
                    channelId: 'default',
                }
        
        
        });
    */

 const requestPermission = async () => {

    const {authorizationStatus} = await notifee.requestPermission();

    if(authorizationStatus !== AuthorizationStatus.AUTHORIZED) {
        Alert.alert(
            'Permissão negada',
            'A permissão para mostrar notificações foi negada.',
        );
    }
}

const activateNotification = async () => {

    await notifee.createChannel({
        id: 'default',
        name: 'Pomodoro',
    })


    notifee.displayNotification({
        id: 'promodoro_progress',
        title: 'NotifPomodoroicação',
        body: 'Iniciando Notificação',
        subtitle: 'subtitulo da noticacao',

        android: {
            ongoing: true,
            timeoutAfter: 1000,
            channelId: 'default',
            progress: {
                max: 1,
                current: 1,
                indeterminate: true,
            }
        }
        
        
    });
}

const deactivateNotification = async () => {
   await notifee.cancelAllNotifications();
}

export const NotificationService = {
    requestPermission,
    activateNotification,
    deactivateNotification,
};